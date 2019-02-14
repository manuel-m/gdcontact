import { isFunction, isNull, isNullOrUndef } from 'inferno-shared';
import { delegatedEvents, handleEvent } from './events/delegation';
import { EMPTY_OBJ, findDOMfromVNode, removeVNodeDOM } from './utils/common';
import { unmountRef } from '../core/refs';
export function remove(vNode, parentDOM) {
    unmount(vNode);
    if (parentDOM) {
        removeVNodeDOM(vNode, parentDOM);
    }
}
export function unmount(vNode) {
    const flags = vNode.flags;
    const children = vNode.children;
    let ref;
    if (flags & 481 /* Element */) {
        ref = vNode.ref;
        const props = vNode.props;
        unmountRef(ref);
        const childFlags = vNode.childFlags;
        if (!isNull(props)) {
            const keys = Object.keys(props);
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i];
                if (delegatedEvents[key]) {
                    handleEvent(key, null, vNode.dom);
                }
            }
        }
        if (childFlags & 12 /* MultipleChildren */) {
            unmountAllChildren(children);
        }
        else if (childFlags === 2 /* HasVNodeChildren */) {
            unmount(children);
        }
    }
    else if (children) {
        if (flags & 4 /* ComponentClass */) {
            if (isFunction(children.componentWillUnmount)) {
                children.componentWillUnmount();
            }
            unmountRef(vNode.ref);
            children.$UN = true;
            unmount(children.$LI);
        }
        else if (flags & 8 /* ComponentFunction */) {
            ref = vNode.ref;
            if (!isNullOrUndef(ref) && isFunction(ref.onComponentWillUnmount)) {
                ref.onComponentWillUnmount(findDOMfromVNode(vNode, true), vNode.props || EMPTY_OBJ);
            }
            unmount(children);
        }
        else if (flags & 1024 /* Portal */) {
            remove(children, vNode.ref);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags & 12 /* MultipleChildren */) {
                unmountAllChildren(children);
            }
        }
    }
}
export function unmountAllChildren(children) {
    for (let i = 0, len = children.length; i < len; ++i) {
        unmount(children[i]);
    }
}
export function clearDOM(dom) {
    // Optimization for clearing dom
    dom.textContent = '';
}
export function removeAllChildren(dom, vNode, children) {
    unmountAllChildren(children);
    if (vNode.flags & 8192 /* Fragment */) {
        removeVNodeDOM(vNode, dom);
    }
    else {
        clearDOM(dom);
    }
}
