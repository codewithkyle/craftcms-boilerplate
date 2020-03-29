class NotificationManager {
    constructor() {
        this.handleCloseClickEvent = this.removeNotification.bind(this);
        this.handleActionButtonClick = this.activateButton.bind(this);
        this._queue = [];
        this._callback = () => { };
        this._isRunning = false;
        this._time = 0;
    }
    activateButton(e) {
        const buttonEl = e.currentTarget;
        const button = this._queue[0].buttons[parseInt(buttonEl.dataset.index)];
        button.callback();
        this.removeNotification();
    }
    createNotification(notification) {
        const el = document.createElement("snackbar-component");
        el.setAttribute("position", notification.position);
        for (let i = 0; i < notification.classes.length; i++) {
            el.classList.add(notification.classes[i]);
        }
        const message = document.createElement("p");
        message.innerText = notification.message;
        el.appendChild(message);
        if (notification.closeable || notification.buttons.length) {
            const actionsWrapper = document.createElement("snackbar-actions");
            if (notification.buttons.length) {
                for (let i = 0; i < notification.buttons.length; i++) {
                    const button = document.createElement("button");
                    button.innerText = notification.buttons[i].label;
                    button.dataset.index = `${i}`;
                    for (let k = 0; k < notification.buttons[i].classes.length; k++) {
                        button.classList.add(notification.buttons[i].classes[k]);
                    }
                    if (notification.buttons[i].ariaLabel) {
                        button.setAttribute("aria-label", notification.buttons[i].ariaLabel);
                    }
                    button.addEventListener("click", this.handleActionButtonClick);
                    actionsWrapper.appendChild(button);
                }
            }
            if (notification.closeable) {
                const closeButton = document.createElement("close-button");
                closeButton.setAttribute("aria-label", "close notification");
                closeButton.setAttribute("aria-pressed", "false");
                closeButton.setAttribute("role", "button");
                closeButton.innerHTML =
                    '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>';
                closeButton.addEventListener("click", this.handleCloseClickEvent);
                actionsWrapper.appendChild(closeButton);
            }
            el.appendChild(actionsWrapper);
        }
        document.body.appendChild(el);
        notification.element = el;
    }
    removeNotification() {
        const closeButton = this._queue[0].element.querySelector("close-button");
        if (closeButton) {
            closeButton.removeEventListener("click", this.handleCloseClickEvent);
        }
        const buttons = Array.from(this._queue[0].element.querySelectorAll("button"));
        if (buttons.length) {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].removeEventListener("click", this.activateButton);
            }
        }
        this._queue[0].element.remove();
        this._queue.splice(0, 1);
        if (this._queue.length !== 0) {
            this.createNotification(this._queue[0]);
        }
        else {
            this.stopCallback();
        }
    }
    startCallback() {
        if (this._isRunning) {
            return;
        }
        this._isRunning = true;
        this._callback = this.animationFrameCallback.bind(this);
        this._time = performance.now();
        this._callback();
        this.createNotification(this._queue[0]);
    }
    stopCallback() {
        this._isRunning = false;
        this._callback = () => { };
    }
    animationFrameCallback() {
        if (this._queue.length === 0 || !this._isRunning) {
            this.stopCallback();
            return;
        }
        const newTime = performance.now();
        const deltaTime = (newTime - this._time) / 1000;
        this._time = newTime;
        if (document.hasFocus() && this._queue[0].duration !== Infinity) {
            this._queue[0].duration -= deltaTime;
            if (this._queue[0].duration <= 0) {
                this.removeNotification();
            }
        }
        window.requestAnimationFrame(() => {
            this._callback();
        });
    }
    validateNotification(notification) {
        return new Promise((resolve, reject) => {
            const newNotification = {};
            let warnings = [];
            if (notification.element) {
                reject("Notifications create their own HTMLElement, do not provide one.");
            }
            if (!notification.message) {
                reject("Notifications require a message.");
            }
            else {
                newNotification.message = notification.message;
            }
            if (notification.closeable) {
                newNotification.closeable = notification.closeable;
            }
            else {
                newNotification.closeable = false;
            }
            if (notification.duration) {
                newNotification.duration = notification.duration;
                if (notification.duration === Infinity && newNotification.closeable) {
                    newNotification.duration = Infinity;
                }
            }
            else {
                newNotification.duration = 10;
            }
            if (notification.position) {
                warnings.push("The position property is deprecated");
                if (notification.position.match("top")) {
                    newNotification.position = "top";
                }
                else if (notification.position.match("bottom")) {
                    newNotification.position = "bottom";
                }
                else {
                    newNotification.position = "bottom";
                }
                if (notification.position.match("left")) {
                    newNotification.position += " left";
                }
                else if (notification.position.match("right")) {
                    newNotification.position += " right";
                }
                else if (notification.position.match("center")) {
                    newNotification.position += " center";
                }
                else {
                    newNotification.position += " center";
                }
            }
            else {
                newNotification.position = "bottom center";
            }
            if (notification.buttons) {
                const buttons = [];
                for (let i = 0; i < notification.buttons.length; i++) {
                    const button = {};
                    const newWarnings = [];
                    if (notification.buttons[i].label) {
                        button.label = notification.buttons[i].label;
                    }
                    else {
                        newWarnings.push("Buttons require a label.");
                    }
                    if (notification.buttons[i].callback) {
                        if (typeof notification.buttons[i].callback === "function") {
                            button.callback = notification.buttons[i].callback;
                        }
                        else {
                            newWarnings.push("Buttons callbacks must be a function.");
                        }
                    }
                    else {
                        newWarnings.push("Buttons require a callback function.");
                    }
                    if (notification.buttons[i].ariaLabel) {
                        button.ariaLabel = notification.buttons[i].ariaLabel;
                    }
                    if (notification.buttons[i].classes) {
                        if (typeof notification.buttons[i].classes === "string") {
                            button.classes = [notification.buttons[i].classes];
                        }
                        else if (Array.isArray(notification.buttons[i].classes)) {
                            button.classes = notification.buttons[i].classes;
                        }
                        else {
                            reject("Notification classes must be a string or an array of strings.");
                        }
                    }
                    else {
                        button.classes = [];
                    }
                    warnings = [...warnings, ...newWarnings];
                    if (newWarnings.length === 0) {
                        buttons.push(button);
                    }
                }
                if (buttons.length) {
                    newNotification.buttons = buttons;
                }
            }
            else {
                newNotification.buttons = [];
            }
            if (notification.force) {
                newNotification.force = notification.force;
            }
            else {
                newNotification.force = false;
            }
            if (notification.classes) {
                if (typeof notification.classes === "string") {
                    newNotification.classes = [notification.classes];
                }
                else if (Array.isArray(notification.classes)) {
                    newNotification.classes = notification.classes;
                }
                else {
                    reject("Notification classes must be a string or an array of strings.");
                }
            }
            else {
                newNotification.classes = [];
            }
            resolve({ validNotification: newNotification, warnings: warnings });
        });
    }
    notify(notification) {
        this.validateNotification(notification)
            .then((response) => {
            if (this._queue.length === 0 || !response.validNotification.force) {
                this._queue.push(response.validNotification);
            }
            else if (this._queue.length > 0 && response.validNotification.force) {
                this._queue.splice(1, 0, response.validNotification);
                this.removeNotification();
            }
            this.startCallback();
            if (response.warnings.length !== 0) {
                for (let i = 0; i < response.warnings.length; i++) {
                    console.warn(`NotifyJS: ${response.warnings[i]}`);
                }
            }
        })
            .catch(error => {
            console.error(error);
        });
    }
}

const globalManager = new NotificationManager();
const notify = globalManager.notify.bind(globalManager);

export { NotificationManager, notify };
