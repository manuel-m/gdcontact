export class EventEmitter {
    constructor() {
        this.listeners = [];
    }
    on(cb) {
        this.listeners.push(cb);
        return () => {
            const index = this.listeners.indexOf(cb);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
    emit(data) {
        const listeners = this.listeners;
        for (let i = 0, len = listeners.length; i < len; ++i) {
            listeners[i](data);
        }
    }
}
