import { message } from "wwibs";

export default class NavigationBackdrop extends HTMLElement {
    private handleClick: EventListener = () => {
        message({
            recipient: "navigation-drawer",
            type: "toggle",
            data: {
                open: false,
            },
        });
    };
    connectedCallback() {
        this.addEventListener("click", this.handleClick);
    }
}
