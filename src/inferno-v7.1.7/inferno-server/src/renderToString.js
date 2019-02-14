import { EMPTY_OBJ } from 'inferno';
import { combineFrom, isFunction, isInvalid, isNull, isNullOrUndef, isNumber, isString, isTrue, throwError } from 'inferno-shared';
import { renderStylesToString } from './prop-renderers';
import { createDerivedState, escapeText, isAttributeNameSafe, voidElements } from './utils';
function renderVNodeToString(vNode, parent, context) {
    const flags = vNode.flags;
    const type = vNode.type;
    const props = vNode.props || EMPTY_OBJ;
    const children = vNode.children;
    if ((flags & 14 /* Component */) !== 0) {
        const isClass = flags & 4 /* ComponentClass */;
        if (isClass) {
            const instance = new type(props, context);
            const hasNewAPI = Boolean(type.getDerivedStateFromProps);
            instance.$BS = false;
            instance.$SSR = true;
            let childContext;
            if (isFunction(instance.getChildContext)) {
                childContext = instance.getChildContext();
            }
            if (isNullOrUndef(childContext)) {
                childContext = context;
            }
            else {
                childContext = combineFrom(context, childContext);
            }
            if (instance.props === EMPTY_OBJ) {
                instance.props = props;
            }
            instance.context = context;
            if (!hasNewAPI && isFunction(instance.componentWillMount)) {
                instance.$BR = true;
                instance.componentWillMount();
                instance.$BR = false;
                const pending = instance.$PS;
                if (pending) {
                    const state = instance.state;
                    if (state === null) {
                        instance.state = pending;
                    }
                    else {
                        for (const key in pending) {
                            state[key] = pending[key];
                        }
                    }
                    instance.$PSS = false;
                    instance.$PS = null;
                }
            }
            if (hasNewAPI) {
                instance.state = createDerivedState(instance, props, instance.state);
            }
            const renderOutput = instance.render(props, instance.state, instance.context);
            // In case render returns invalid stuff
            if (isInvalid(renderOutput)) {
                return '<!--!-->';
            }
            if (isString(renderOutput)) {
                return escapeText(renderOutput);
            }
            if (isNumber(renderOutput)) {
                return renderOutput + '';
            }
            return renderVNodeToString(renderOutput, vNode, childContext);
        }
        else {
            const renderOutput = type(props, context);
            if (isInvalid(renderOutput)) {
                return '<!--!-->';
            }
            if (isString(renderOutput)) {
                return escapeText(renderOutput);
            }
            if (isNumber(renderOutput)) {
                return renderOutput + '';
            }
            return renderVNodeToString(renderOutput, vNode, context);
        }
    }
    else if ((flags & 481 /* Element */) !== 0) {
        let renderedString = `<${type}`;
        let html;
        const isVoidElement = voidElements.has(type);
        const className = vNode.className;
        if (isString(className)) {
            renderedString += ` class="${escapeText(className)}"`;
        }
        else if (isNumber(className)) {
            renderedString += ` class="${className}"`;
        }
        if (!isNull(props)) {
            for (const prop in props) {
                const value = props[prop];
                switch (prop) {
                    case 'dangerouslySetInnerHTML':
                        html = value.__html;
                        break;
                    case 'style':
                        if (!isNullOrUndef(props.style)) {
                            renderedString += ` style="${renderStylesToString(props.style)}"`;
                        }
                        break;
                    case 'children':
                    case 'className':
                        // Ignore
                        break;
                    case 'defaultValue':
                        // Use default values if normal values are not present
                        if (!props.value) {
                            renderedString += ` value="${isString(value) ? escapeText(value) : value}"`;
                        }
                        break;
                    case 'defaultChecked':
                        // Use default values if normal values are not present
                        if (!props.checked) {
                            renderedString += ` checked="${value}"`;
                        }
                        break;
                    default:
                        if (isAttributeNameSafe(prop)) {
                            if (isString(value)) {
                                renderedString += ` ${prop}="${escapeText(value)}"`;
                            }
                            else if (isNumber(value)) {
                                renderedString += ` ${prop}="${value}"`;
                            }
                            else if (isTrue(value)) {
                                renderedString += ` ${prop}`;
                            }
                        }
                        break;
                }
            }
            if (type === 'option' && typeof props.value !== 'undefined' && props.value === parent.props.value) {
                // Parent value sets children value
                renderedString += ` selected`;
            }
        }
        if (isVoidElement) {
            renderedString += `>`;
        }
        else {
            renderedString += `>`;
            const childFlags = vNode.childFlags;
            if (childFlags === 2 /* HasVNodeChildren */) {
                renderedString += renderVNodeToString(children, vNode, context);
            }
            else if (childFlags & 12 /* MultipleChildren */) {
                for (let i = 0, len = children.length; i < len; ++i) {
                    renderedString += renderVNodeToString(children[i], vNode, context);
                }
            }
            else if (childFlags === 16 /* HasTextChildren */) {
                renderedString += children === '' ? ' ' : escapeText(children);
            }
            else if (html) {
                renderedString += html;
            }
            if (!isVoidElement) {
                renderedString += `</${type}>`;
            }
        }
        if (String(type).match(/[\s\n\/='"\0<>]/)) {
            throw renderedString;
        }
        return renderedString;
    }
    else if ((flags & 16 /* Text */) !== 0) {
        return children === '' ? ' ' : escapeText(children);
    }
    else if ((flags & 8192 /* Fragment */) !== 0) {
        const childFlags = vNode.childFlags;
        if (childFlags === 2 /* HasVNodeChildren */) {
            return '<!--!-->';
        }
        else if (childFlags & 12 /* MultipleChildren */) {
            let renderedString = '';
            for (let i = 0, len = children.length; i < len; ++i) {
                renderedString += renderVNodeToString(children[i], vNode, context);
            }
            return renderedString;
        }
    }
    else {
        if (process.env.NODE_ENV !== 'production') {
            if (typeof vNode === 'object') {
                throwError(`renderToString() received an object that's not a valid VNode, you should stringify it first. Object: "${JSON.stringify(vNode)}".`);
            }
            else {
                throwError(`renderToString() expects a valid VNode, instead it received an object with the type "${typeof vNode}".`);
            }
        }
        throwError();
    }
    return '';
}
export function renderToString(input) {
    return renderVNodeToString(input, {}, {});
}
