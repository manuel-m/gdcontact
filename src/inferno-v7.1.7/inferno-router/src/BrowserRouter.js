import { Component, createComponentVNode } from 'inferno';
import { createBrowserHistory } from 'history';
import { Router } from './Router';
import { warning } from './utils';
export class BrowserRouter extends Component {
    constructor(props, context) {
        super(props, context);
        this.history = createBrowserHistory(props);
    }
    render() {
        return createComponentVNode(4 /* ComponentClass */, Router, {
            children: this.props.children,
            history: this.history
        });
    }
}
if (process.env.NODE_ENV !== 'production') {
    BrowserRouter.prototype.componentWillMount = function () {
        warning(!this.props.history, '<BrowserRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { BrowserRouter as Router }`.');
    };
}
