import { message } from "@codewithkyle/messaging";

export default class NavigationBackdrop extends HTMLElement {
	private handleClick: EventListener = () => {
		message({
			recipient: "navigation-drawer",
			data: {
				type: "toggle",
				open: false,
			},
		});
	};
	connectedCallback() {
		this.addEventListener("click", this.handleClick);
	}
}
