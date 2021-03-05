class SuperComponent extends HTMLElement {
    constructor() {
        super();
        // @ts-ignore
        this.model = {};
        this.state = "INACTIVE";
        this.stateMachine = {};
    }
    update(model) {
        this.model = Object.assign(this.model, model);
        this.updated();
        this.render();
    }
    trigger(trigger) {
        this.state = this.stateMachine?.[this.state]?.[trigger] ?? "ERROR";
        this.updated();
        this.render();
    }
    render() { }
    updated() { }
    connected() { }
    connectedCallback() {
        this.connected();
    }
    disconnected() { }
    disconnectedCallback() {
        this.disconnected();
    }
}

export default SuperComponent;
