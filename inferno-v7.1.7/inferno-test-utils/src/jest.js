import { render, rerender } from 'inferno';
import { isArray, isNullOrUndef } from 'inferno-shared';
import { getTagNameOfVNode } from './utils';
// Jest Snapshot Utilities
// Jest formats it's snapshots prettily because it knows how to play with the React test renderer.
// Symbols and algorithm have been reversed from the following file:
// https://github.com/facebook/react/blob/v15.4.2/src/renderers/testing/ReactTestRenderer.js#L98
const symbolValue = typeof Symbol === 'undefined' ? 'react.test.json' : Symbol.for('react.test.json');
function createSnapshotObject(object) {
    Object.defineProperty(object, '$$typeof', {
        value: symbolValue
    });
    return object;
}
function buildVNodeSnapshot(vNode) {
    const flags = vNode.flags;
    const children = vNode.children;
    let childVNode;
    if (flags & 4 /* ComponentClass */) {
        childVNode = buildVNodeSnapshot(children.$LI);
    }
    else if (flags & 8 /* ComponentFunction */) {
        childVNode = buildVNodeSnapshot(children);
    }
    if (vNode.childFlags === 2 /* HasVNodeChildren */) {
        childVNode = buildVNodeSnapshot(children);
    }
    else if (vNode.childFlags & 12 /* MultipleChildren */) {
        childVNode = [];
        for (let i = 0, len = children.length; i < len; ++i) {
            childVNode.push(buildVNodeSnapshot(children[i]));
        }
    }
    else if (vNode.childFlags & 16 /* HasTextChildren */) {
        childVNode = vNode.children + '';
    }
    if (flags & 481 /* Element */) {
        const snapShotProps = {};
        const props = vNode.props;
        if (props) {
            const keys = Object.keys(props);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                const value = props[key];
                if (value !== undefined) {
                    snapShotProps[key] = value;
                }
            }
        }
        if (!isNullOrUndef(vNode.className)) {
            snapShotProps.className = vNode.className;
        }
        // Jest expects children to always be array
        if (childVNode && !isArray(childVNode)) {
            childVNode = [childVNode];
        }
        return createSnapshotObject({
            children: childVNode,
            props: snapShotProps,
            type: getTagNameOfVNode(vNode)
        });
    }
    else if (flags & 16 /* Text */) {
        childVNode = vNode.children + '';
    }
    return childVNode;
}
export function vNodeToSnapshot(vNode) {
    return buildVNodeSnapshot(vNode);
}
export function renderToSnapshot(input) {
    render(input, document.createElement('div'));
    rerender(); // Flush all pending set state calls
    const snapshot = vNodeToSnapshot(input);
    if (isArray(snapshot)) {
        for (let i = 0; i < snapshot.length; ++i) {
            const _snapshot = snapshot[i];
            if (typeof _snapshot === 'object' && _snapshot.props) {
                delete _snapshot.props.children;
            }
        }
    }
    else if (typeof snapshot === 'object' && snapshot.props) {
        delete snapshot.props.children;
    }
    return snapshot;
}
