import { hookup, message } from "wwibs";

type NavigationDrawerState = {
    open: boolean;
};

export default class NavigationDrawer extends HTMLElement {
    private state: NavigationDrawerState;
    private closeButton: HTMLElement;
    constructor() {
        super();
        this.state = {
            open: false,
        };
        this.closeButton = this.querySelector("button");
    }

    private inbox(data): void {
        const { type } = data;
        switch (type) {
            case "toggle":
                this.state.open = data.open;
                this.update();
                break;
            default:
                console.warn(`Undefined Navigation Drawer message type: "${type}"`);
                break;
        }
    }

    private update() {
        this.setAttribute("state", `${this.state.open ? "open" : "closed"}`);
        if (this.state.open) {
            this.closeButton.focus();
        }
    }

    private handleKeypress: EventListener = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === "escape") {
            this.state.open = false;
            this.update();
        }
    };

    private closeDrawer: EventListener = (e: Event) => {
        message({
            recipient: "navigation-drawer",
            type: "toggle",
            data: { open: false },
        });
    };

    connectedCallback() {
        hookup("navigation-drawer", this.inbox.bind(this));
        document.addEventListener("keyup", this.handleKeypress);
        this.closeButton.addEventListener("click", this.closeDrawer);
    }
}
