import { isFunction, isInvalid, isNullOrUndef, throwError, warning } from 'inferno-shared';
import { directClone } from '../core/implementation';
import { mount } from './mounting';
import { patch } from './patching';
import { remove } from './unmounting';
import { callAll, options, EMPTY_OBJ, renderCheck } from './utils/common';
const hasDocumentAvailable = typeof document !== 'undefined';
if (process.env.NODE_ENV !== 'production') {
    if (hasDocumentAvailable && !document.body) {
        warning('Inferno warning: you cannot initialize inferno without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.');
    }
}
let documentBody = null;
if (hasDocumentAvailable) {
    documentBody = document.body;
    /*
     * Defining $EV and $V properties on Node.prototype
     * fixes v8 "wrong map" de-optimization
     */
    Node.prototype.$EV = null;
    Node.prototype.$V = null;
}
export function __render(input, parentDOM, callback, context) {
    // Development warning
    if (process.env.NODE_ENV !== 'production') {
        if (documentBody === parentDOM) {
            throwError('you cannot render() to the "document.body". Use an empty element as a container instead.');
        }
        if (isInvalid(parentDOM)) {
            throwError(`render target ( DOM ) is mandatory, received ${parentDOM === null ? 'null' : typeof parentDOM}`);
        }
    }
    const lifecycle = [];
    let rootInput = parentDOM.$V;
    renderCheck.v = true;
    if (isNullOrUndef(rootInput)) {
        if (!isNullOrUndef(input)) {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            mount(input, parentDOM, context, false, null, lifecycle);
            parentDOM.$V = input;
            rootInput = input;
        }
    }
    else {
        if (isNullOrUndef(input)) {
            remove(rootInput, parentDOM);
            parentDOM.$V = null;
        }
        else {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            patch(rootInput, input, parentDOM, context, false, null, lifecycle);
            rootInput = parentDOM.$V = input;
        }
    }
    if (lifecycle.length > 0) {
        callAll(lifecycle);
    }
    renderCheck.v = false;
    if (isFunction(callback)) {
        callback();
    }
    if (isFunction(options.renderComplete)) {
        options.renderComplete(rootInput, parentDOM);
    }
}
export function render(input, parentDOM, callback = null, context = EMPTY_OBJ) {
    __render(input, parentDOM, callback, context);
}
export function createRenderer(parentDOM) {
    return function renderer(lastInput, nextInput, callback, context) {
        if (!parentDOM) {
            parentDOM = lastInput;
        }
        render(nextInput, parentDOM, callback, context);
    };
}
