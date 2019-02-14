import { combineFrom, isNull, isObject } from 'inferno-shared';
// We need EMPTY_OBJ defined in one place.
// Its used for comparison so we cant inline it into shared
export const EMPTY_OBJ = {};
export const Fragment = '$F';
if (process.env.NODE_ENV !== 'production') {
    Object.freeze(EMPTY_OBJ);
}
export function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
export function appendChild(parentDOM, dom) {
    parentDOM.appendChild(dom);
}
export function insertOrAppend(parentDOM, newNode, nextNode) {
    if (isNull(nextNode)) {
        appendChild(parentDOM, newNode);
    }
    else {
        parentDOM.insertBefore(newNode, nextNode);
    }
}
export function documentCreateElement(tag, isSVG) {
    if (isSVG) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }
    return document.createElement(tag);
}
export function replaceChild(parentDOM, newDom, lastDom) {
    parentDOM.replaceChild(newDom, lastDom);
}
export function removeChild(parentDOM, childNode) {
    parentDOM.removeChild(childNode);
}
export function callAll(arrayFn) {
    let listener;
    while ((listener = arrayFn.shift()) !== undefined) {
        listener();
    }
}
export function findDOMfromVNode(vNode, start) {
    let flags;
    let children;
    while (vNode) {
        flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            return vNode.dom;
        }
        children = vNode.children;
        if (flags & 8192 /* Fragment */) {
            vNode = vNode.childFlags === 2 /* HasVNodeChildren */ ? children : children[start ? 0 : children.length - 1];
        }
        else if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        else {
            vNode = children;
        }
    }
    return null;
}
export function removeVNodeDOM(vNode, parentDOM) {
    const flags = vNode.flags;
    if (flags & 2033 /* DOMRef */) {
        removeChild(parentDOM, vNode.dom);
    }
    else {
        const children = vNode.children;
        if (flags & 4 /* ComponentClass */) {
            removeVNodeDOM(children.$LI, parentDOM);
        }
        else if (flags & 8 /* ComponentFunction */) {
            removeVNodeDOM(children, parentDOM);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                removeVNodeDOM(children, parentDOM);
            }
            else {
                for (let i = 0, len = children.length; i < len; ++i) {
                    removeVNodeDOM(children[i], parentDOM);
                }
            }
        }
    }
}
export function moveVNodeDOM(vNode, parentDOM, nextNode) {
    const flags = vNode.flags;
    if (flags & 2033 /* DOMRef */) {
        insertOrAppend(parentDOM, vNode.dom, nextNode);
    }
    else {
        const children = vNode.children;
        if (flags & 4 /* ComponentClass */) {
            moveVNodeDOM(children.$LI, parentDOM, nextNode);
        }
        else if (flags & 8 /* ComponentFunction */) {
            moveVNodeDOM(children, parentDOM, nextNode);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                moveVNodeDOM(children, parentDOM, nextNode);
            }
            else {
                for (let i = 0, len = children.length; i < len; ++i) {
                    moveVNodeDOM(children[i], parentDOM, nextNode);
                }
            }
        }
    }
}
export function getComponentName(instance) {
    // Fallback for IE
    return instance.name || instance.displayName || instance.constructor.name || (instance.toString().match(/^function\s*([^\s(]+)/) || [])[1];
}
export function createDerivedState(instance, nextProps, state) {
    if (instance.constructor.getDerivedStateFromProps) {
        return combineFrom(state, instance.constructor.getDerivedStateFromProps(nextProps, state));
    }
    return state;
}
export const renderCheck = {
    v: false
};
export const options = {
    componentComparator: null,
    createVNode: null,
    renderComplete: null
};
export function setTextContent(dom, children) {
    dom.textContent = children;
}
export function isSameLinkEvent(lastValue, nextValue) {
    return (lastValue &&
        nextValue &&
        isObject(lastValue) &&
        isObject(nextValue) &&
        lastValue.event === nextValue.event &&
        lastValue.data === nextValue.data);
}
