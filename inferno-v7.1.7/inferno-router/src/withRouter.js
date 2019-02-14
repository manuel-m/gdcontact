import { createComponentVNode } from 'inferno';
import hoistNonReactStatics from 'hoist-non-inferno-statics';
import { Route } from './Route';
import { combineFrom } from 'inferno-shared';
/**
 * A public higher-order component to access the imperative API
 */
export function withRouter(Com) {
    const C = function (props) {
        const { wrappedComponentRef, ...remainingProps } = props;
        return createComponentVNode(4 /* ComponentClass */, Route, {
            render(routeComponentProps) {
                return createComponentVNode(2 /* ComponentUnknown */, Com, combineFrom(remainingProps, routeComponentProps), null, wrappedComponentRef);
            }
        });
    };
    C.displayName = `withRouter(${Com.displayName || Com.name})`;
    C.WrappedComponent = Com;
    return hoistNonReactStatics(C, Com);
}
