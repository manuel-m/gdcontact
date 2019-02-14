import { render } from 'inferno';
import { isArray, isFunction, isInvalid, isNullOrUndef, isObject, isString, throwError } from 'inferno-shared';
import { getTagNameOfVNode as _getTagNameOfVNode, isClassVNode as _isClassVNode, isComponentVNode as _isComponentVNode, isDOMVNode as _isDOMVNode, isFunctionalVNode as _isFunctionalVNode, isTextVNode as _isTextVNode, isVNode as _isVNode, Wrapper as _Wrapper } from './utils';
import { renderToSnapshot as _renderToSnapshot, vNodeToSnapshot as _vNodeToSnapshot } from './jest';
// Type Checkers
export function isVNodeOfType(instance, type) {
    return _isVNode(instance) && instance.type === type;
}
export function isDOMVNodeOfType(instance, type) {
    return _isDOMVNode(instance) && instance.type === type;
}
export function isFunctionalVNodeOfType(instance, type) {
    return _isFunctionalVNode(instance) && instance.type === type;
}
export function isClassVNodeOfType(instance, type) {
    return _isClassVNode(instance) && instance.type === type;
}
export function isComponentVNodeOfType(inst, type) {
    return (_isFunctionalVNode(inst) || _isClassVNode(inst)) && inst.type === type;
}
export function isDOMElement(instance) {
    return Boolean(instance) && isObject(instance) && instance.nodeType === 1 && isString(instance.tagName);
}
export function isDOMElementOfType(instance, type) {
    return isDOMElement(instance) && isString(type) && instance.tagName.toLowerCase() === type.toLowerCase();
}
export function isRenderedClassComponent(instance) {
    return (Boolean(instance) && isObject(instance) && _isVNode(instance.$LI) && isFunction(instance.render) && isFunction(instance.setState));
}
export function isRenderedClassComponentOfType(instance, type) {
    return isRenderedClassComponent(instance) && isFunction(type) && instance.constructor === type;
}
// Recursive Finder Functions
export function findAllInRenderedTree(renderedTree, predicate) {
    if (isRenderedClassComponent(renderedTree)) {
        return findAllInVNodeTree(renderedTree.$LI, predicate);
    }
    else {
        return findAllInVNodeTree(renderedTree, predicate);
    }
}
export function findAllInVNodeTree(vNodeTree, predicate) {
    if (_isVNode(vNodeTree)) {
        let result = predicate(vNodeTree) ? [vNodeTree] : [];
        const children = vNodeTree.children;
        if (isRenderedClassComponent(children)) {
            result = result.concat(findAllInVNodeTree(children.$LI, predicate));
        }
        else if (_isVNode(children)) {
            result = result.concat(findAllInVNodeTree(children, predicate));
        }
        else if (isArray(children)) {
            children.forEach(child => {
                if (!isInvalid(child)) {
                    result = result.concat(findAllInVNodeTree(child, predicate));
                }
            });
        }
        return result;
    }
    else {
        throwError('findAllInVNodeTree(vNodeTree, predicate) vNodeTree must be a VNode instance');
    }
}
// Finder Helpers
function parseSelector(filter) {
    if (isArray(filter)) {
        return filter;
    }
    else if (isString(filter)) {
        return filter.trim().split(/\s+/);
    }
    else {
        return [];
    }
}
function findOneOf(tree, filter, name, finder) {
    const all = finder(tree, filter);
    if (all.length > 1) {
        throwError(`Did not find exactly one match (found ${all.length}) for ${name}: ${filter}`);
    }
    else {
        return all[0];
    }
}
// Scry Utilities
export function scryRenderedDOMElementsWithClass(renderedTree, classNames) {
    return findAllInRenderedTree(renderedTree, instance => {
        if (_isDOMVNode(instance)) {
            let domClassName = !isNullOrUndef(instance.dom) ? instance.dom.className : '';
            if (!isString(domClassName) && !isNullOrUndef(instance.dom) && isFunction(instance.dom.getAttribute)) {
                // SVG || null, probably
                domClassName = instance.dom.getAttribute('class') || '';
            }
            const domClassList = parseSelector(domClassName);
            return parseSelector(classNames).every(className => {
                return domClassList.indexOf(className) !== -1;
            });
        }
        return false;
    }).map(instance => instance.dom);
}
export function scryRenderedDOMElementsWithTag(renderedTree, tagName) {
    return findAllInRenderedTree(renderedTree, instance => {
        return isDOMVNodeOfType(instance, tagName);
    }).map(instance => instance.dom);
}
export function scryRenderedVNodesWithType(renderedTree, type) {
    return findAllInRenderedTree(renderedTree, instance => isVNodeOfType(instance, type));
}
export function scryVNodesWithType(vNodeTree, type) {
    return findAllInVNodeTree(vNodeTree, instance => isVNodeOfType(instance, type));
}
// Find Utilities
export function findRenderedDOMElementWithClass(renderedTree, classNames) {
    return findOneOf(renderedTree, classNames, 'class', scryRenderedDOMElementsWithClass);
}
export function findRenderedDOMElementWithTag(renderedTree, tagName) {
    return findOneOf(renderedTree, tagName, 'tag', scryRenderedDOMElementsWithTag);
}
export function findRenderedVNodeWithType(renderedTree, type) {
    return findOneOf(renderedTree, type, 'component', scryRenderedVNodesWithType);
}
export function findVNodeWithType(vNodeTree, type) {
    return findOneOf(vNodeTree, type, 'VNode', scryVNodesWithType);
}
export function renderIntoContainer(input) {
    const container = document.createElement('div');
    render(input, container);
    const rootInput = container.$V;
    if (rootInput && rootInput.flags & 14 /* Component */) {
        return rootInput.children;
    }
    return rootInput;
}
export const vNodeToSnapshot = _vNodeToSnapshot;
export const renderToSnapshot = _renderToSnapshot;
export const getTagNameOfVNode = _getTagNameOfVNode;
export const isClassVNode = _isClassVNode;
export const isComponentVNode = _isComponentVNode;
export const isDOMVNode = _isDOMVNode;
export const isFunctionalVNode = _isFunctionalVNode;
export const isTextVNode = _isTextVNode;
export const isVNode = _isVNode;
export const Wrapper = _Wrapper;
