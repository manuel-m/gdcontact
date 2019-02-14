import { Component } from 'inferno';
import { warning } from '../utils/warning';
let didWarnAboutReceivingStore = false;
const warnAboutReceivingStore = () => {
    if (didWarnAboutReceivingStore) {
        return;
    }
    didWarnAboutReceivingStore = true;
    warning('<Provider> does not support changing `store` on the fly.');
};
export class Provider extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
    }
    getChildContext() {
        return { store: this.store, storeSubscription: null };
    }
    render() {
        return this.props.children;
    }
}
Provider.displayName = 'Provider';
if (process.env.NODE_ENV !== 'production') {
    Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        const { store } = this;
        const { store: nextStore } = nextProps;
        if (store !== nextStore) {
            warnAboutReceivingStore();
        }
    };
}
