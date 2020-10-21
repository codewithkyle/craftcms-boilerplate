export default class BannerNotification extends HTMLElement {
	connectedCallback() {
		if (!localStorage.getItem("notificationBannerHash")) {
			localStorage.setItem("notificationBannerHash", this.dataset.hash);
			this.style.visibility = "visible";
			this.style.transform = "translateY(0)";
			const button = this.querySelector("button");
			button.addEventListener("click", () => {
				this.remove();
			});
			button.focus();
		}
	}
}
