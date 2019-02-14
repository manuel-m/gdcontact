import { isNull, isObject } from 'inferno-shared';
export function isValidElement(obj) {
    const isNotANullObject = isObject(obj) && isNull(obj) === false;
    if (isNotANullObject === false) {
        return false;
    }
    const flags = obj.flags;
    return (flags & (14 /* Component */ | 481 /* Element */)) > 0;
}
