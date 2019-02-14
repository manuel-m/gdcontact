import { createComponentVNode } from 'inferno';
import { Route } from './Route';
import { Link } from './Link';
import { combineFrom } from 'inferno-shared';
function filter(i) {
    return i;
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
export function NavLink({ to, exact, strict, onClick, location: linkLocation, activeClassName = 'active', className, activeStyle, style, isActive: getIsActive, ariaCurrent = 'true', ...rest }) {
    function linkComponent({ location, match }) {
        const isActive = !!(getIsActive ? getIsActive(match, location) : match);
        return createComponentVNode(8 /* ComponentFunction */, Link, combineFrom({
            'aria-current': isActive && ariaCurrent,
            className: isActive ? [className, activeClassName].filter(filter).join(' ') : className,
            onClick,
            style: isActive ? combineFrom(style, activeStyle) : style,
            to
        }, rest));
    }
    return createComponentVNode(4 /* ComponentClass */, Route, {
        children: linkComponent,
        exact,
        location: linkLocation,
        path: typeof to === 'object' ? to.pathname : to,
        strict
    });
}
