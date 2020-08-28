import { message } from "djinnjs/broadcaster";

class NavigationBackdrop extends HTMLElement {
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
customElements.define("navigation-backdrop", NavigationBackdrop);
