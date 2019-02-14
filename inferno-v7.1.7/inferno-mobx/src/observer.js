import { createAtom, Reaction, _allowStateChanges } from 'mobx';
import { Component, createComponentVNode } from 'inferno';
import { EventEmitter } from './utils/EventEmitter';
import { warning } from 'inferno-shared';
import { isStateless } from './utils/utils';
import hoistNonReactStatics from 'hoist-non-inferno-statics';
/**
 * dev tool support
 */
let isDevtoolsEnabled = false;
let isUsingStaticRendering = false;
let warnedAboutObserverInjectDeprecation = false;
export const renderReporter = new EventEmitter();
function reportRendering(component) {
    const node = component.$LI.dom;
    renderReporter.emit({
        component,
        event: 'render',
        node,
        renderTime: component.__$mobRenderEnd - component.__$mobRenderStart,
        totalTime: Date.now() - component.__$mobRenderStart
    });
}
export function trackComponents() {
    if (!isDevtoolsEnabled) {
        isDevtoolsEnabled = true;
        warning('Do not turn trackComponents on in production, its expensive. For tracking dom nodes you need inferno-compat.');
    }
    else {
        isDevtoolsEnabled = false;
        renderReporter.listeners.length = 0;
    }
}
export function useStaticRendering(useStatic) {
    isUsingStaticRendering = useStatic;
}
/**
 * Errors reporter
 */
export const errorsReporter = new EventEmitter();
/**
 * Utilities
 */
function patch(target, funcName, runMixinFirst) {
    const base = target[funcName];
    const mixinFunc = reactiveMixin[funcName];
    const f = !base
        ? mixinFunc
        : runMixinFirst === true
            ? function () {
                mixinFunc.apply(this, arguments);
                base.apply(this, arguments);
            }
            : function () {
                base.apply(this, arguments);
                mixinFunc.apply(this, arguments);
            };
    // MWE: ideally we freeze here to protect against accidental overwrites in component instances, see #195
    // ...but that breaks react-hot-loader, see #231...
    target[funcName] = f;
}
function isObjectShallowModified(prev, next) {
    if (null == prev || null == next || typeof prev !== 'object' || typeof next !== 'object') {
        return prev !== next;
    }
    const keys = Object.keys(prev);
    if (keys.length !== Object.keys(next).length) {
        return true;
    }
    let key;
    for (let i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        if (next[key] !== prev[key]) {
            return true;
        }
    }
    return false;
}
/**
 * ReactiveMixin
 */
const reactiveMixin = {
    componentWillMount() {
        if (isUsingStaticRendering === true) {
            return;
        }
        // Generate friendly name for debugging
        const initialName = this.displayName || this.name || (this.constructor && (this.constructor.displayName || this.constructor.name)) || '<component>';
        /**
         * If props are shallowly modified, react will render anyway,
         * so atom.reportChanged() should not result in yet another re-render
         */
        let skipRender = false;
        /**
         * forceUpdate will re-assign this.props. We don't want that to cause a loop,
         * so detect these changes
         */
        function makePropertyObservableReference(propName) {
            let valueHolder = this[propName];
            const atom = createAtom('reactive ' + propName);
            Object.defineProperty(this, propName, {
                configurable: true,
                enumerable: true,
                get() {
                    atom.reportObserved();
                    return valueHolder;
                },
                set(v) {
                    if (isObjectShallowModified(valueHolder, v)) {
                        valueHolder = v;
                        skipRender = true;
                        atom.reportChanged();
                        skipRender = false;
                    }
                    else {
                        valueHolder = v;
                    }
                }
            });
        }
        // make this.props an observable reference, see #124
        makePropertyObservableReference.call(this, 'props');
        // make state an observable reference
        makePropertyObservableReference.call(this, 'state');
        // wire up reactive render
        const me = this;
        const render = this.render.bind(this);
        const baseRender = () => render(me.props, me.state, me.context);
        let reaction = null;
        let isRenderingPending = false;
        const initialRender = () => {
            reaction = new Reaction(`${initialName}.render()`, () => {
                if (!isRenderingPending) {
                    // N.B. Getting here *before mounting* means that a component constructor has side effects (see the relevant test in misc.js)
                    // This unidiomatic React usage but React will correctly warn about this so we continue as usual
                    // See #85 / Pull #44
                    isRenderingPending = true;
                    if (typeof this.componentWillReact === 'function') {
                        this.componentWillReact(); // TODO: wrap in action?
                    }
                    if (!skipRender) {
                        this.forceUpdate();
                    }
                }
            });
            reaction.reactComponent = this;
            reactiveRender.$mobx = reaction;
            this.render = reactiveRender;
            return reactiveRender();
        };
        const reactiveRender = () => {
            isRenderingPending = false;
            let exception;
            let rendering = null;
            reaction.track(() => {
                if (isDevtoolsEnabled) {
                    this.__$mobRenderStart = Date.now();
                }
                try {
                    rendering = _allowStateChanges(false, baseRender);
                }
                catch (e) {
                    exception = e;
                }
                if (isDevtoolsEnabled) {
                    this.__$mobRenderEnd = Date.now();
                }
            });
            if (exception) {
                errorsReporter.emit(exception);
                throw exception;
            }
            return rendering;
        };
        this.render = initialRender;
    },
    componentWillUnmount() {
        if (isUsingStaticRendering === true) {
            return;
        }
        if (this.render.$mobx) {
            this.render.$mobx.dispose();
        }
        if (isDevtoolsEnabled) {
            const node = this.$LI.dom;
            renderReporter.emit({
                component: this,
                event: 'destroy',
                node
            });
        }
    },
    componentDidMount() {
        if (isDevtoolsEnabled) {
            reportRendering(this);
        }
    },
    componentDidUpdate() {
        if (isDevtoolsEnabled) {
            reportRendering(this);
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        if (isUsingStaticRendering) {
            warning('[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.');
        }
        // update on any state changes (as is the default)
        if (this.state !== nextState) {
            return true;
        }
        // update if props are shallowly not equal, inspired by PureRenderMixin
        // we could return just 'false' here, and avoid the `skipRender` checks etc
        // however, it is nicer if lifecycle events are triggered like usually,
        // so we return true here if props are shallowly modified.
        return isObjectShallowModified(this.props, nextProps);
    }
};
export function observer(arg1, arg2) {
    var _a;
    if (typeof arg1 === 'string') {
        throw new Error('Store names should be provided as array');
    }
    if (Array.isArray(arg1)) {
        // component needs stores
        if (!warnedAboutObserverInjectDeprecation) {
            warnedAboutObserverInjectDeprecation = true;
            warning('Mobx observer: Using observer to inject stores is deprecated since 4.0. Use `@inject("store1", "store2") @observer ComponentClass` or `inject("store1", "store2")(observer(componentClass))` instead of `@observer(["store1", "store2"]) ComponentClass`');
        }
        if (!arg2) {
            // invoked as decorator
            return componentClass => observer(arg1, componentClass);
        }
        else {
            return inject.apply(null, arg1)(observer(arg2));
        }
    }
    const component = arg1;
    if (component.isMobxInjector === true) {
        warning("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'");
    }
    // Stateless function component:
    // If it is function but doesn't seem to be a react class constructor,
    // wrap it to a react class automatically
    if (typeof component === 'function' && (!component.prototype || !component.prototype.render)) {
        return observer((_a = class extends Component {
                render(props, _state, context) {
                    return component(props, context);
                }
            },
            _a.displayName = component.displayName || component.name,
            _a.defaultProps = component.defaultProps,
            _a));
    }
    if (!component) {
        throw new Error("Please pass a valid component to 'observer'");
    }
    const target = component.prototype || component;
    mixinLifecycleEvents(target);
    component.isMobXReactObserver = true;
    return component;
}
function mixinLifecycleEvents(target) {
    patch(target, 'componentWillMount', true);
    patch(target, 'componentDidMount', false);
    patch(target, 'componentWillUnmount', false);
    patch(target, 'componentDidUpdate', false);
    if (!target.shouldComponentUpdate) {
        target.shouldComponentUpdate = reactiveMixin.shouldComponentUpdate;
    }
}
// TODO: support injection somehow as well?
export const Observer = observer(({ children }) => children());
Observer.displayName = 'Observer';
const proxiedInjectorProps = {
    isMobxInjector: {
        configurable: true,
        enumerable: true,
        value: true,
        writable: true
    }
};
/**
 * Store Injection
 */
function createStoreInjector(grabStoresFn, component, injectNames) {
    let displayName = 'inject-' + (component.displayName || component.name || (component.constructor && component.constructor.name) || 'Unknown');
    if (injectNames) {
        displayName += '-with-' + injectNames;
    }
    class Injector extends Component {
        constructor(props, context) {
            super(props, context);
            this.storeRef = this.storeRef.bind(this);
        }
        storeRef(instance) {
            this.wrappedInstance = instance;
        }
        render(props, _state, context) {
            // Optimization: it might be more efficient to apply the mapper function *outside* the render method
            // (if the mapper is a function), that could avoid expensive(?) re-rendering of the injector component
            // See this test: 'using a custom injector is not too reactive' in inject.js
            const newProps = {};
            let key;
            for (key in props) {
                newProps[key] = props[key];
            }
            const additionalProps = grabStoresFn(context.mobxStores || {}, newProps, context) || {};
            for (key in additionalProps) {
                newProps[key] = additionalProps[key];
            }
            return createComponentVNode(2 /* ComponentUnknown */, component, newProps, null, isStateless(component) ? null : this.storeRef);
        }
    }
    Injector.displayName = displayName;
    Injector.isMobxInjector = false;
    // Static fields from component should be visible on the generated Injector
    hoistNonReactStatics(Injector, component);
    Injector.wrappedComponent = component;
    Object.defineProperties(Injector, proxiedInjectorProps);
    return Injector;
}
function grabStoresByName(storeNames) {
    return function (baseStores, nextProps) {
        for (let i = 0, len = storeNames.length; i < len; ++i) {
            const storeName = storeNames[i];
            if (!(storeName in nextProps)) {
                // Development warning
                if (process.env.NODE_ENV !== 'production') {
                    if (!(storeName in baseStores)) {
                        throw new Error("MobX injector: Store '" + storeName + "' is not available! Make sure it is provided by some Provider");
                    }
                }
                nextProps[storeName] = baseStores[storeName];
            }
        }
        return nextProps;
    };
}
export function inject( /* fn(stores, nextProps) or ...storeNames */) {
    let grabStoresFn;
    if (typeof arguments[0] === 'function') {
        grabStoresFn = arguments[0];
        return function (componentClass) {
            let injected = createStoreInjector(grabStoresFn, componentClass);
            injected.isMobxInjector = false; // supress warning
            // mark the Injector as observer, to make it react to expressions in `grabStoresFn`,
            // see #111
            injected = observer(injected);
            injected.isMobxInjector = true; // restore warning
            return injected;
        };
    }
    else {
        const storeNames = [];
        for (let i = 0; i < arguments.length; ++i) {
            storeNames.push(arguments[i]);
        }
        grabStoresFn = grabStoresByName(storeNames);
        return function (componentClass) {
            return createStoreInjector(grabStoresFn, componentClass, storeNames.join('-'));
        };
    }
}