import { Component } from 'inferno';
import { isNumber, isObject } from 'inferno-shared';
export function isVNode(inst) {
    return Boolean(inst) && isObject(inst) && isNumber(inst.flags) && inst.flags > 0;
}
export function isTextVNode(inst) {
    return (inst.flags & 16 /* Text */) > 0;
}
export function isFunctionalVNode(inst) {
    return isVNode(inst) && (inst.flags & 8 /* ComponentFunction */) > 0;
}
export function isClassVNode(inst) {
    return isVNode(inst) && (inst.flags & 4 /* ComponentClass */) > 0;
}
export function isComponentVNode(inst) {
    return isFunctionalVNode(inst) || isClassVNode(inst);
}
export function getTagNameOfVNode(vNode) {
    return (vNode && vNode.dom && vNode.dom.tagName.toLowerCase()) || undefined;
}
export function isDOMVNode(vNode) {
    return !isComponentVNode(vNode) && !isTextVNode(vNode) && (vNode.flags & 481 /* Element */) > 0;
}
export class Wrapper extends Component {
    render() {
        return this.props.children;
    }
}
