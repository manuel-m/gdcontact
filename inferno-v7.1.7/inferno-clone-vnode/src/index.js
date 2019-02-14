import { createComponentVNode, createFragment, createTextVNode, createVNode, EMPTY_OBJ, normalizeProps } from 'inferno';
import { combineFrom } from 'inferno-shared';
/*
 directClone is preferred over cloneVNode and used internally also.
 This function makes Inferno backwards compatible.
 And can be tree-shaked by modern bundlers

 Would be nice to combine this with directClone but could not do it without breaking change
*/
/**
 * Clones given virtual node by creating new instance of it
 * @param {VNode} vNodeToClone virtual node to be cloned
 * @param {Props=} props additional props for new virtual node
 * @param {...*} _children new children for new virtual node
 * @returns {VNode} new virtual node
 */
export function cloneVNode(vNodeToClone, props, _children) {
    const flags = vNodeToClone.flags;
    let children = flags & 14 /* Component */ ? vNodeToClone.props && vNodeToClone.props.children : vNodeToClone.children;
    let childLen = arguments.length - 2;
    let className = vNodeToClone.className;
    let key = vNodeToClone.key;
    let ref = vNodeToClone.ref;
    if (props) {
        if (props.className !== void 0) {
            className = props.className;
        }
        if (props.ref !== void 0) {
            ref = props.ref;
        }
        if (props.key !== void 0) {
            key = props.key;
        }
        if (props.children !== void 0) {
            children = props.children;
        }
    }
    else {
        props = {};
    }
    if (childLen === 1) {
        children = _children;
    }
    else if (childLen > 1) {
        children = [];
        while (childLen-- > 0) {
            children[childLen] = arguments[childLen + 2];
        }
    }
    props.children = children;
    if (flags & 14 /* Component */) {
        return createComponentVNode(flags, vNodeToClone.type, !vNodeToClone.props && !props ? EMPTY_OBJ : combineFrom(vNodeToClone.props, props), key, ref);
    }
    if (flags & 16 /* Text */) {
        return createTextVNode(children);
    }
    if (flags & 8192 /* Fragment */) {
        return createFragment(childLen === 1 ? [children] : children, 0 /* UnknownChildren */, key);
    }
    return normalizeProps(createVNode(flags, vNodeToClone.type, className, null, 1 /* HasInvalidChildren */, combineFrom(vNodeToClone.props, props), key, ref));
}
