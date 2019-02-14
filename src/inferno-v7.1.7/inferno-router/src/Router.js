import { Component } from 'inferno';
import { warning } from './utils';
import { combineFrom } from 'inferno-shared';
/**
 * The public API for putting history on context.
 */
export class Router extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            match: this.computeMatch(props.history.location.pathname)
        };
    }
    getChildContext() {
        const childContext = combineFrom(this.context.router, null);
        childContext.history = this.props.history;
        childContext.route = {
            location: childContext.history.location,
            match: this.state.match
        };
        return {
            router: childContext
        };
    }
    computeMatch(pathname) {
        return {
            isExact: pathname === '/',
            params: {},
            path: '/',
            url: '/'
        };
    }
    componentWillMount() {
        const { history } = this.props;
        // Do this here so we can setState when a <Redirect> changes the
        // location in componentWillMount. This happens e.g. when doing
        // server rendering using a <StaticRouter>.
        this.unlisten = history.listen(() => {
            this.setState({
                match: this.computeMatch(history.location.pathname)
            });
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }
    render(props) {
        return props.children;
    }
}
if (process.env.NODE_ENV !== 'production') {
    Router.prototype.componentWillReceiveProps = function (nextProps) {
        warning(this.props.history === nextProps.history, 'You cannot change <Router history>');
    };
}
