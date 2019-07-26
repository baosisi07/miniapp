export default {
    listeners: [],
    on(type, handle) {
        if (typeof handle === 'function') {
            console.debug(`listen event ${type}`);
            this.listeners.push([type, handle]);
        }
    },
    emit(type, ...params) {
        this.listeners.forEach(([listenType, handle]) => type === listenType && handle(...params));
        console.debug(`receive event ${type}: ${JSON.stringify(params)}`);
    },
    removeAllListeners() {
        this.listeners = [];
    },
    off(type) {
        let index = -1;

        if (this.listeners.some(([itype, ihandle]) => {
                index++;
                return itype === type;
            })
        ) {
            this.listeners.splice(index, 1);
        }
    },
};
