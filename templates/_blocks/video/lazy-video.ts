import { env, dataSaver } from "djinnjs/env";

class LazyVideoComponent extends HTMLElement {
	private video: HTMLIFrameElement | null;
	private playerState: "loading" | "loaded" | "waiting";
	private container: HTMLElement;
	private loadingSpinner: HTMLElement;

	constructor() {
		super();
		this.video = null;
		this.playerState = "waiting";
		this.container = this.querySelector(".js-container");
		this.loadingSpinner = this.querySelector("loading-spinner");
	}

	private handleVideoLoadEvent: EventListener = () => {
		this.playerState = "loaded";
		this.container.setAttribute("player-state", "playing");
		this.loadingSpinner.classList.add("is-hidden");
	};

	private loadYouTube(userTriggerd: boolean): void {
		const iframe = document.createElement("iframe") as HTMLIFrameElement;
		iframe.width = "320";
		iframe.height = "180";
		iframe.src = `https://www.youtube-nocookie.com/embed/${this.dataset.videoId.trim()}?rel=0${userTriggerd ? "&autoplay=1" : ""}`;
		iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
		iframe.frameBorder = "0";
		iframe.setAttribute("loading", "eager");
		iframe.setAttribute("allowfullscreen", "true");
		iframe.style.zIndex = "5";
		iframe.addEventListener("load", this.handleVideoLoadEvent);
		this.video = iframe;
		this.container.append(iframe);
	}

	private loadVimeo(userTriggerd: boolean): void {
		const iframe = document.createElement("iframe") as HTMLIFrameElement;
		iframe.width = "320";
		iframe.height = "180";
		iframe.src = `https://player.vimeo.com/video/${this.dataset.videoId.trim()}?title=0&byline=0&portrait=0${userTriggerd ? "&autoplay=1" : ""}`;
		iframe.allow = "autoplay; fullscreen";
		iframe.frameBorder = "0";
		iframe.setAttribute("loading", "eager");
		iframe.setAttribute("allowfullscreen", "true");
		iframe.style.zIndex = "5";
		iframe.addEventListener("load", this.handleVideoLoadEvent);
		this.video = iframe;
		this.container.append(iframe);
	}

	private loadVideo(userTriggerd = false): void {
		this.loadingSpinner.classList.remove("is-hidden");

		switch (this.dataset.platform.toLowerCase().trim()) {
			case "youtube":
				this.loadYouTube(userTriggerd);
				break;
			case "vimeo":
				this.loadVimeo(userTriggerd);
				break;
			default:
				console.error(`Unknown platform: ${this.dataset.platform}`);
				break;
		}
	}

	private handleButtonClickEvent: EventListener = () => {
		if (this.playerState === "waiting") {
			this.playerState = "loading";
			this.container.setAttribute("player-state", "loading");
			this.loadVideo(true);
		} else if (this.playerState == "loading") {
			this.container.setAttribute("player-state", "loading");
		} else if (this.playerState === "loaded" && this.video) {
			this.container.setAttribute("player-state", "playing");
		}
	};

	connectedCallback(): void {
		if (env.connection === "4g" && !dataSaver) {
			this.loadVideo();
		}
		this.addEventListener("click", this.handleButtonClickEvent);
		const button = this.querySelector(".js-button");
		if (button) {
			button.classList.add("is-visible");
			this.loadingSpinner.classList.add("is-hidden");
		}
	}
}
customElements.define("lazy-video", LazyVideoComponent);
