export const ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
export const isArray = Array.isArray;
export function isStringOrNumber(o) {
    const type = typeof o;
    return type === 'string' || type === 'number';
}
export function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
}
export function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
}
export function isFunction(o) {
    return typeof o === 'function';
}
export function isString(o) {
    return typeof o === 'string';
}
export function isNumber(o) {
    return typeof o === 'number';
}
export function isNull(o) {
    return o === null;
}
export function isTrue(o) {
    return o === true;
}
export function isUndefined(o) {
    return o === void 0;
}
export function isObject(o) {
    return typeof o === 'object';
}
export function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(`Inferno Error: ${message}`);
}
export function warning(message) {
    // tslint:disable-next-line:no-console
    console.error(message);
}
export function combineFrom(first, second) {
    const out = {};
    if (first) {
        for (const key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (const key in second) {
            out[key] = second[key];
        }
    }
    return out;
}
