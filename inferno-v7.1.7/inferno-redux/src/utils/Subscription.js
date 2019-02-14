const CLEARED = null;
// tslint:disable-next-line:no-empty
const nullSubscriptionHandler = () => { };
const nullListenerCollection = {
    // tslint:disable-next-line:no-empty
    clear: () => { },
    // tslint:disable-next-line:no-empty
    notify: () => { },
    subscribe: (_) => nullSubscriptionHandler
};
const createListenerCollection = () => {
    // the current/next pattern is copied from redux's createStore code.
    let current = [];
    let next = [];
    return {
        clear: () => {
            next = CLEARED;
            current = CLEARED;
        },
        notify: () => {
            const listeners = (current = next);
            for (let i = 0; i < listeners.length; ++i) {
                listeners[i]();
            }
        },
        subscribe: (listener) => {
            let isSubscribed = true;
            if (next === current) {
                next = current.slice();
            }
            next.push(listener);
            return () => {
                if (!isSubscribed || current === null) {
                    return;
                }
                isSubscribed = false;
                if (next === current) {
                    next = current.slice();
                }
                next.splice(next.indexOf(listener), 1);
            };
        }
    };
};
export class Subscription {
    constructor(store, parentSub, onStateChange) {
        this.store = store;
        this.parentSub = parentSub;
        this.onStateChange = onStateChange;
        this.unsubscribe = null;
        this.listeners = nullListenerCollection;
    }
    addNestedSub(listener) {
        this.trySubscribe();
        return this.listeners.subscribe(listener);
    }
    notifyNestedSubs() {
        this.listeners.notify();
    }
    isSubscribed() {
        return Boolean(this.unsubscribe);
    }
    trySubscribe() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);
            this.listeners = createListenerCollection();
        }
    }
    tryUnsubscribe() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
            this.listeners.clear();
            this.listeners = nullListenerCollection;
        }
    }
}
