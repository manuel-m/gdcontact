import { Component, createComponentVNode } from 'inferno';
import { createHashHistory } from 'history';
import { Router } from './Router';
import { warning } from './utils';
export class HashRouter extends Component {
    constructor(props, context) {
        super(props, context);
        this.history = createHashHistory(props);
    }
    render() {
        return createComponentVNode(4 /* ComponentClass */, Router, {
            children: this.props.children,
            history: this.history
        });
    }
}
if (process.env.NODE_ENV !== 'production') {
    HashRouter.prototype.componentWillMount = function () {
        warning(!this.props.history, '<HashRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { HashRouter as Router }`.');
    };
}
