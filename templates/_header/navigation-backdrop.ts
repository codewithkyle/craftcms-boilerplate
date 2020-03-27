import { message } from "djinnjs/broadcaster";

class NavigationBackdrop extends HTMLElement {
	private handleClick: EventListener = () => {
		message("navigation-drawer", {
			type: "toggle",
			open: false,
		});
	};
	connectedCallback() {
		this.addEventListener("click", this.handleClick);
	}
}
customElements.define("navigation-backdrop", NavigationBackdrop);
