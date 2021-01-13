import { hookup, reply, disconnect } from "wwibs";

export default class ConnectionChecker extends HTMLElement {
    private liteButton: HTMLButtonElement;
    private fullButton: HTMLButtonElement;
    private replyId: string;
    private inboxUid: string;

    constructor() {
        super();
        this.inboxUid = hookup("user-input", this.inbox.bind(this));
        this.liteButton = this.querySelector(".js-lite");
        this.fullButton = this.querySelector(".js-full");
    }

    private inbox(data) {
        switch (data.type) {
            case "lightweight-check":
                this.style.display = "block";
                this.replyId = data.replyId;
                break;
            default:
                break;
        }
    }

    private handleLiteClick: EventListener = () => {
        reply({
            replyId: this.replyId,
            type: "use-lite",
        });
        this.remove();
    };

    private handleFullClick: EventListener = () => {
        reply({
            replyId: this.replyId,
            type: "use-full",
        });
        this.remove();
    };

    connectedCallback() {
        this.liteButton.addEventListener("click", this.handleLiteClick);
        this.fullButton.addEventListener("click", this.handleFullClick);
    }

    disconnectedCallback() {
        this.liteButton.removeEventListener("click", this.handleLiteClick);
        this.fullButton.removeEventListener("click", this.handleFullClick);
        disconnect(this.inboxUid);
    }
}
