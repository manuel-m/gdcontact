import { Component, createComponentVNode } from 'inferno';
import { createMemoryHistory } from 'history';
import { Router } from './Router';
import { warning } from './utils';
export class MemoryRouter extends Component {
    constructor(props, context) {
        super(props, context);
        this.history = createMemoryHistory(props);
    }
    render() {
        return createComponentVNode(4 /* ComponentClass */, Router, {
            children: this.props.children,
            history: this.history
        });
    }
}
if (process.env.NODE_ENV !== 'production') {
    MemoryRouter.prototype.componentWillMount = function () {
        warning(!this.props.history, '<MemoryRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { MemoryRouter as Router }`.');
    };
}
