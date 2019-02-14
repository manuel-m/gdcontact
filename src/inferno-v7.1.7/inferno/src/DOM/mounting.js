import { isFunction, isNull, isNullOrUndef, isString, isStringOrNumber, throwError } from 'inferno-shared';
import { createVoidVNode, directClone } from '../core/implementation';
import { documentCreateElement, EMPTY_OBJ, findDOMfromVNode, insertOrAppend, setTextContent } from './utils/common';
import { mountProps } from './props';
import { createClassComponentInstance, handleComponentInput } from './utils/componentutil';
import { validateKeys } from '../core/validate';
import { mountRef } from '../core/refs';
export function mount(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    const flags = (vNode.flags |= 16384 /* InUse */);
    if (flags & 481 /* Element */) {
        mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 4 /* ComponentClass */) {
        mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 8 /* ComponentFunction */) {
        mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 512 /* Void */ || flags & 16 /* Text */) {
        mountText(vNode, parentDOM, nextNode);
    }
    else if (flags & 8192 /* Fragment */) {
        mountFragment(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 1024 /* Portal */) {
        mountPortal(vNode, context, parentDOM, nextNode, lifecycle);
    }
    else if (process.env.NODE_ENV !== 'production') {
        // Development validation, in production we don't need to throw because it crashes anyway
        if (typeof vNode === 'object') {
            throwError(`mount() received an object that's not a valid VNode, you should stringify it first, fix createVNode flags or call normalizeChildren. Object: "${JSON.stringify(vNode)}".`);
        }
        else {
            throwError(`mount() expects a valid VNode, instead it received an object with the type "${typeof vNode}".`);
        }
    }
}
function mountPortal(vNode, context, parentDOM, nextNode, lifecycle) {
    mount(vNode.children, vNode.ref, context, false, null, lifecycle);
    const placeHolderVNode = createVoidVNode();
    mountText(placeHolderVNode, parentDOM, nextNode);
    vNode.dom = placeHolderVNode.dom;
}
function mountFragment(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    let children = vNode.children;
    let childFlags = vNode.childFlags;
    // When fragment is optimized for multiple children, check if there is no children and change flag to invalid
    // This is the only normalization always done, to keep optimization flags API same for fragments and regular elements
    if (childFlags & 12 /* MultipleChildren */ && children.length === 0) {
        childFlags = vNode.childFlags = 2 /* HasVNodeChildren */;
        children = vNode.children = createVoidVNode();
    }
    if (childFlags === 2 /* HasVNodeChildren */) {
        mount(children, parentDOM, nextNode, isSVG, nextNode, lifecycle);
    }
    else {
        mountArrayChildren(children, parentDOM, context, isSVG, nextNode, lifecycle);
    }
}
export function mountText(vNode, parentDOM, nextNode) {
    const dom = (vNode.dom = document.createTextNode(vNode.children));
    if (!isNull(parentDOM)) {
        insertOrAppend(parentDOM, dom, nextNode);
    }
}
export function mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    const flags = vNode.flags;
    const props = vNode.props;
    const className = vNode.className;
    const ref = vNode.ref;
    let children = vNode.children;
    const childFlags = vNode.childFlags;
    isSVG = isSVG || (flags & 32 /* SvgElement */) > 0;
    const dom = documentCreateElement(vNode.type, isSVG);
    vNode.dom = dom;
    if (!isNullOrUndef(className) && className !== '') {
        if (isSVG) {
            dom.setAttribute('class', className);
        }
        else {
            dom.className = className;
        }
    }
    if (process.env.NODE_ENV !== 'production') {
        validateKeys(vNode);
    }
    if (childFlags === 16 /* HasTextChildren */) {
        setTextContent(dom, children);
    }
    else if (childFlags !== 1 /* HasInvalidChildren */) {
        const childrenIsSVG = isSVG && vNode.type !== 'foreignObject';
        if (childFlags === 2 /* HasVNodeChildren */) {
            if (children.flags & 16384 /* InUse */) {
                vNode.children = children = directClone(children);
            }
            mount(children, dom, context, childrenIsSVG, null, lifecycle);
        }
        else if (childFlags === 8 /* HasKeyedChildren */ || childFlags === 4 /* HasNonKeyedChildren */) {
            mountArrayChildren(children, dom, context, childrenIsSVG, null, lifecycle);
        }
    }
    if (!isNull(parentDOM)) {
        insertOrAppend(parentDOM, dom, nextNode);
    }
    if (!isNull(props)) {
        mountProps(vNode, flags, props, dom, isSVG);
    }
    if (process.env.NODE_ENV !== 'production') {
        if (isString(ref)) {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback ref or Inferno.createRef() API instead.');
        }
    }
    mountRef(ref, dom, lifecycle);
}
export function mountArrayChildren(children, dom, context, isSVG, nextNode, lifecycle) {
    for (let i = 0, len = children.length; i < len; ++i) {
        let child = children[i];
        if (child.flags & 16384 /* InUse */) {
            children[i] = child = directClone(child);
        }
        mount(child, dom, context, isSVG, nextNode, lifecycle);
    }
}
export function mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    const instance = createClassComponentInstance(vNode, vNode.type, vNode.props || EMPTY_OBJ, context, isSVG, lifecycle);
    mount(instance.$LI, parentDOM, instance.$CX, isSVG, nextNode, lifecycle);
    mountClassComponentCallbacks(vNode.ref, instance, lifecycle);
}
export function mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    const type = vNode.type;
    const props = vNode.props || EMPTY_OBJ;
    const ref = vNode.ref;
    const input = handleComponentInput(vNode.flags & 32768 /* ForwardRef */ ? type(props, ref, context) : type(props, context));
    vNode.children = input;
    mount(input, parentDOM, context, isSVG, nextNode, lifecycle);
    mountFunctionalComponentCallbacks(props, ref, vNode, lifecycle);
}
function createClassMountCallback(instance) {
    return () => {
        instance.componentDidMount();
    };
}
export function mountClassComponentCallbacks(ref, instance, lifecycle) {
    mountRef(ref, instance, lifecycle);
    if (process.env.NODE_ENV !== 'production') {
        if (isStringOrNumber(ref)) {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback ref or Inferno.createRef() API instead.');
        }
        else if (!isNullOrUndef(ref) && typeof ref === 'object' && ref.current === void 0) {
            throwError('functional component lifecycle events are not supported on ES2015 class components.');
        }
    }
    if (isFunction(instance.componentDidMount)) {
        lifecycle.push(createClassMountCallback(instance));
    }
}
function createOnMountCallback(ref, vNode, props) {
    return () => {
        ref.onComponentDidMount(findDOMfromVNode(vNode, true), props);
    };
}
export function mountFunctionalComponentCallbacks(props, ref, vNode, lifecycle) {
    if (!isNullOrUndef(ref)) {
        if (isFunction(ref.onComponentWillMount)) {
            ref.onComponentWillMount(props);
        }
        if (isFunction(ref.onComponentDidMount)) {
            lifecycle.push(createOnMountCallback(ref, vNode, props));
        }
    }
}
