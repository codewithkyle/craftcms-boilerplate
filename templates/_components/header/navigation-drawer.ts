import { register, message } from "@codewithkyle/messaging";
import SuperComponent from "@codewithkyle/supercomponent";

type NavigationDrawerState = {
	open: boolean;
};

export default class NavigationDrawer extends SuperComponent<NavigationDrawerState> {
	private closeButton: HTMLElement;
	constructor() {
		super();
		this.model = {
			open: false,
		};
		this.closeButton = this.querySelector("button");
	}

	private inbox(e): void {
		const { type, open } = e.data;
		switch (type) {
			case "toggle":
				this.update({
					open: open,
				});
				break;
			default:
				console.warn(`Undefined Navigation Drawer message type: "${type}"`);
				break;
		}
	}

	render() {
		this.setAttribute("state", `${this.model.open ? "open" : "closed"}`);
		if (this.model.open) {
			this.closeButton.focus();
		}
	}

	private handleKeypress: EventListener = (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === "escape") {
			this.update({
				open: false,
			});
		}
	};

	private closeDrawer: EventListener = (e: Event) => {
		message({
			recipient: "navigation-drawer",
			data: {
				type: "toggle",
				open: false,
			},
		});
	};

	connected() {
		register("navigation-drawer", this.inbox.bind(this));
		document.addEventListener("keyup", this.handleKeypress);
		this.closeButton.addEventListener("click", this.closeDrawer);
	}
}
