import { Component } from 'inferno';
import { createLocation, locationsAreEqual } from 'history';
import { invariant } from './utils';
export class Redirect extends Component {
    isStatic() {
        return this.context.router && this.context.router.staticContext;
    }
    componentWillMount() {
        invariant(this.context.router, 'You should not use <Redirect> outside a <Router>');
        if (this.isStatic()) {
            this.perform();
        }
    }
    componentDidMount() {
        if (!this.isStatic()) {
            this.perform();
        }
    }
    componentDidUpdate(prevProps) {
        const prevTo = createLocation(prevProps.to);
        const nextTo = createLocation(this.props.to);
        if (locationsAreEqual(prevTo, nextTo)) {
            // tslint:disable-next-line:no-console
            console.error(`You tried to redirect to the same route you're currently on: "${nextTo.pathname}${nextTo.search}"`);
            return;
        }
        this.perform();
    }
    perform() {
        const { history } = this.context.router;
        const { push = false, to } = this.props;
        if (push) {
            history.push(to);
        }
        else {
            history.replace(to);
        }
    }
    render() {
        return null;
    }
}