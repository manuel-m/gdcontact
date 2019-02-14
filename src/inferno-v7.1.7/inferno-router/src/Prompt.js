import { Component } from 'inferno';
import { invariant } from './utils';
/**
 * The public API for matching a single path and rendering.
 */
export class Prompt extends Component {
    enable(message) {
        if (this.unblock) {
            this.unblock();
        }
        this.unblock = this.context.router.history.block(message);
    }
    disable() {
        if (this.unblock) {
            this.unblock();
            this.unblock = null;
        }
    }
    componentWillMount() {
        invariant(this.context.router, 'You should not use <Prompt> outside a <Router>');
        if (this.props.when) {
            this.enable(this.props.message);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.when) {
            if (!this.props.when || this.props.message !== nextProps.message) {
                this.enable(nextProps.message);
            }
        }
        else {
            this.disable();
        }
    }
    componentWillUnmount() {
        this.disable();
    }
    render() {
        return null;
    }
}
