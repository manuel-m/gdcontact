import { warning } from 'inferno-shared';
import {
  createComponentVNode,
  createPortal,
  createTextVNode,
  createVNode,
  directClone,
  getFlagsForElementVnode,
  normalizeProps,
  createFragment,
} from './core/implementation';
import { linkEvent } from './DOM/events/linkEvent';
import { createRenderer, render, __render } from './DOM/rendering';
import {
  EMPTY_OBJ,
  findDOMfromVNode,
  Fragment,
  options,
} from './DOM/utils/common';
import { Component, rerender } from './core/component';
import { mountProps } from './DOM/props';
import {
  handleComponentInput,
  createClassComponentInstance,
} from './DOM/utils/componentutil';
import {
  mount,
  mountClassComponentCallbacks,
  mountElement,
  mountFunctionalComponentCallbacks,
  mountText,
} from './DOM/mounting';
import { createRef, forwardRef, mountRef } from './core/refs';
if (process.env.NODE_ENV !== 'production') {
  /* tslint:disable-next-line:no-empty */
  const testFunc = function testFn() {};
  /* tslint:disable-next-line*/
  console.log('Inferno is in development mode.');
  if ((testFunc.name || testFunc.toString()).indexOf('testFn') === -1) {
    warning(
      "It looks like you're using a minified copy of the development build " +
        'of Inferno. When deploying Inferno apps to production, make sure to use ' +
        'the production build which skips development warnings and is faster. ' +
        'See http://infernojs.org for more details.',
    );
  }
}
const version = process.env.INFERNO_VERSION;
export {
  Component,
  Fragment,
  EMPTY_OBJ,
  createComponentVNode,
  createFragment,
  createPortal,
  createRef,
  createRenderer,
  createTextVNode,
  createVNode,
  forwardRef,
  directClone,
  findDOMfromVNode,
  getFlagsForElementVnode,
  linkEvent,
  normalizeProps,
  options,
  render,
  rerender,
  version,
  // Internal methods, used by hydration
  createClassComponentInstance as _CI,
  handleComponentInput as _HI,
  mount as _M,
  mountClassComponentCallbacks as _MCCC,
  mountElement as _ME,
  mountFunctionalComponentCallbacks as _MFCC,
  mountRef as _MR,
  mountText as _MT,
  mountProps as _MP,
  __render,
};
