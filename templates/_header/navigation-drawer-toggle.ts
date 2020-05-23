import { message } from "djinnjs/broadcaster";

class NavigationDrawerToggle extends HTMLElement {
	private input: HTMLInputElement;
	private label: HTMLLabelElement;
	constructor() {
		super();
		this.input = this.querySelector("input#navigation-drawer-toggle");
		this.label = this.querySelector("label");
	}
	private handleChange: EventListener = (e: Event) => {
		message({
			recipient: "navigation-drawer",
			type: "toggle",
			data: {
				open: true,
			},
		});
	};
	private handleKeyboard: EventListener = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase();
		if (key === " ") {
			message({
				recipient: "navigation-drawer",
				type: "toggle",
				data: {
					open: true,
				},
			});
		}
	};
	connectedCallback() {
		this.input.addEventListener("change", this.handleChange);
		this.label.addEventListener("keydown", this.handleKeyboard);
	}
}
customElements.define("navigation-drawer-toggle", NavigationDrawerToggle);
