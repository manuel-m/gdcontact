import { Component, createComponentVNode } from 'inferno';
import { createPath, parsePath } from 'history';
import { Router } from './Router';
import { invariant, warning } from './utils';
import { combineFrom } from 'inferno-shared';
function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
}
// tslint:disable-next-line:no-empty
const noop = () => { };
export class StaticRouter extends Component {
    constructor() {
        super(...arguments);
        this.createHref = path => addLeadingSlash(this.props.basename + createURL(path));
        this.handlePush = location => {
            const { basename, context } = this.props;
            context.action = 'PUSH';
            context.location = addBasename(basename, createLocation(location));
            context.url = createURL(context.location);
        };
        this.handleReplace = location => {
            const { basename, context } = this.props;
            context.action = 'REPLACE';
            context.location = addBasename(basename, createLocation(location));
            context.url = createURL(context.location);
        };
        // tslint:disable-next-line:no-empty
        this.handleListen = () => noop;
        // tslint:disable-next-line:no-empty
        this.handleBlock = () => noop;
    }
    getChildContext() {
        return {
            router: {
                staticContext: this.props.context
            }
        };
    }
    render({ basename, context, location, ...props }) {
        return createComponentVNode(4 /* ComponentClass */, Router, combineFrom(props, {
            history: {
                action: 'POP',
                block: this.handleBlock,
                createHref: this.createHref,
                go: staticHandler('go'),
                goBack: staticHandler('goBack'),
                goForward: staticHandler('goForward'),
                listen: this.handleListen,
                location: stripBasename(basename, createLocation(location)),
                push: this.handlePush,
                replace: this.handleReplace
            }
        }));
    }
}
StaticRouter.defaultProps = {
    basename: '',
    location: '/'
};
if (process.env.NODE_ENV !== 'production') {
    StaticRouter.prototype.componentWillMount = function () {
        warning(!this.props.history, '<StaticRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { StaticRouter as Router }`.');
    };
}
function normalizeLocation({ pathname = '/', search, hash }) {
    return {
        hash: (hash || '') === '#' ? '' : hash,
        pathname,
        search: (search || '') === '?' ? '' : search
    };
}
function addBasename(basename, location) {
    if (!basename) {
        return location;
    }
    return combineFrom(location, { pathname: addLeadingSlash(basename) + location.pathname });
}
function stripBasename(basename, location) {
    if (!basename) {
        return location;
    }
    const base = addLeadingSlash(basename);
    if (location.pathname.indexOf(base) !== 0) {
        return location;
    }
    return combineFrom(location, { pathname: location.pathname.substr(base.length) });
}
function createLocation(location) {
    return typeof location === 'string' ? parsePath(location) : normalizeLocation(location);
}
function createURL(location) {
    return typeof location === 'string' ? location : createPath(location);
}
function staticHandler(methodName) {
    return () => {
        invariant(false, 'You cannot %s with <StaticRouter>', methodName);
    };
}
