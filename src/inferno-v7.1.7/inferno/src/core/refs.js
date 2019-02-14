import { isFunction, warning } from 'inferno-shared';
export function createRef() {
    return {
        current: null
    };
}
export const forwardRef = process.env.NODE_ENV !== 'production'
    ? function (render) {
        if (!isFunction(render)) {
            warning(`forwardRef requires a render function but was given ${render === null ? 'null' : typeof render}.`);
            return;
        }
        const fwRef = {
            render
        };
        Object.seal(fwRef);
        return fwRef;
    }
    : function (render) {
        return {
            render
        };
    };
export function pushRef(dom, value, lifecycle) {
    lifecycle.push(() => {
        value(dom);
    });
}
export function unmountRef(ref) {
    if (ref) {
        if (isFunction(ref)) {
            ref(null);
        }
        else if (ref.current) {
            ref.current = null;
        }
    }
}
export function mountRef(ref, value, lifecycle) {
    if (ref) {
        if (isFunction(ref)) {
            pushRef(value, ref, lifecycle);
        }
        else if (ref.current !== void 0) {
            ref.current = value;
        }
    }
}
