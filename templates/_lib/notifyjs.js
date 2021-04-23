class SnackbarComponent extends HTMLElement {
    constructor(snackbar) {
        super();
        this.handleActionButtonClick = (e) => {
            const target = e.currentTarget;
            const index = parseInt(target.dataset.index);
            this.settings.buttons[index].callback();
        };
        this.handleCloseClickEvent = () => {
            this.remove();
        };
        this.settings = snackbar;
        this.render();
    }
    render() {
        this.dataset.uid = this.settings.uid;
        for (let i = 0; i < this.settings.classes.length; i++) {
            this.classList.add(this.settings.classes[i]);
        }
        const message = document.createElement("p");
        message.innerText = this.settings.message;
        if (this.settings.closeable || this.settings.buttons.length) {
            message.setAttribute("role", "alertdialog");
        }
        else {
            message.setAttribute("role", "alert");
        }
        this.appendChild(message);
        if (this.settings.closeable || this.settings.buttons.length) {
            const actionsWrapper = document.createElement("snackbar-actions");
            if (this.settings.buttons.length) {
                for (let i = 0; i < this.settings.buttons.length; i++) {
                    const button = document.createElement("button");
                    button.innerText = this.settings.buttons[i].label;
                    button.dataset.index = `${i}`;
                    for (let k = 0; k < this.settings.buttons[i].classes.length; k++) {
                        button.classList.add(this.settings.buttons[i].classes[k]);
                    }
                    if (this.settings.buttons[i].ariaLabel) {
                        button.setAttribute("aria-label", this.settings.buttons[i].ariaLabel);
                    }
                    button.addEventListener("click", this.handleActionButtonClick);
                    actionsWrapper.appendChild(button);
                }
            }
            if (this.settings.closeable) {
                const closeButton = document.createElement("button");
                closeButton.setAttribute("aria-label", "close notification");
                closeButton.className = "close js-snackbar-close";
                closeButton.innerHTML =
                    '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>';
                closeButton.addEventListener("click", this.handleCloseClickEvent);
                actionsWrapper.appendChild(closeButton);
            }
            this.appendChild(actionsWrapper);
        }
    }
    connectedCallback() {
        if (this.settings.autofocus) {
            const closeButton = this.querySelector(".js-snackbar-close");
            if (closeButton) {
                closeButton.focus();
            }
        }
        if (this.settings.buttons.length) {
            for (let i = 0; i < this.settings.buttons.length; i++) {
                if (this.settings.buttons[i].autofocus) {
                    const button = this.querySelector(`button[data-index="${i}"]`);
                    if (button) {
                        button.focus();
                        break;
                    }
                }
            }
        }
    }
}

class ToastComponent extends HTMLElement {
    constructor(snackbar) {
        super();
        this.handleCloseClickEvent = () => {
            this.remove();
        };
        this.handleActionButtonClick = (e) => {
            const target = e.currentTarget;
            const index = parseInt(target.dataset.index);
            this.settings.buttons[index].callback();
        };
        this.settings = snackbar;
        this.render();
    }
    render() {
        this.dataset.uid = this.settings.uid;
        for (let i = 0; i < this.settings.classes.length; i++) {
            this.classList.add(this.settings.classes[i]);
        }
        if (this.settings.icon) {
            const icon = document.createElement("i");
            icon.innerHTML = this.settings.icon;
            this.appendChild(icon);
        }
        const copyWrapper = document.createElement("copy-wrapper");
        const title = document.createElement("h3");
        title.innerText = this.settings.title;
        if (this.settings.closeable) {
            title.setAttribute("role", "alertdialog");
        }
        else {
            title.setAttribute("role", "alert");
        }
        copyWrapper.appendChild(title);
        const message = document.createElement("p");
        message.innerText = this.settings.message;
        copyWrapper.appendChild(message);
        this.appendChild(copyWrapper);
        if (this.settings.buttons.length) {
            const actionsWrapper = document.createElement("toast-actions");
            for (let i = 0; i < this.settings.buttons.length; i++) {
                const button = document.createElement("button");
                button.innerText = this.settings.buttons[i].label;
                button.dataset.index = `${i}`;
                for (let k = 0; k < this.settings.buttons[i].classes.length; k++) {
                    button.classList.add(this.settings.buttons[i].classes[k]);
                }
                if (this.settings.buttons[i].ariaLabel) {
                    button.setAttribute("aria-label", this.settings.buttons[i].ariaLabel);
                }
                button.addEventListener("click", this.handleActionButtonClick);
                actionsWrapper.appendChild(button);
            }
            copyWrapper.appendChild(actionsWrapper);
        }
        if (this.settings.closeable) {
            const closeButton = document.createElement("button");
            closeButton.setAttribute("aria-label", "close notification");
            closeButton.className = "close js-toast-close";
            closeButton.innerHTML =
                '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>';
            closeButton.addEventListener("click", this.handleCloseClickEvent);
            this.appendChild(closeButton);
        }
        if (this.settings.timer) {
            const timer = document.createElement("toast-timer");
            timer.className = this.settings.timer;
            if (this.settings.timer === "horizontal") {
                timer.style.transform = "scaleX(1)";
            }
            else {
                timer.style.transform = "scaleY(1)";
            }
            this.append(timer);
        }
    }
    connectedCallback() {
        if (this.settings.autofocus) {
            const closeButton = this.querySelector(".js-toast-close");
            if (closeButton) {
                closeButton.focus();
            }
        }
        if (this.settings.buttons.length) {
            for (let i = 0; i < this.settings.buttons.length; i++) {
                if (this.settings.buttons[i].autofocus) {
                    const button = this.querySelector(`button[data-index="${i}"]`);
                    if (button) {
                        button.focus();
                        break;
                    }
                }
            }
        }
    }
}

class Notifier {
    constructor() {
        this.snackbarQueue = [];
        this.toaster = [];
        this.time = performance.now();
        this.loop();
    }
    uid() {
        return new Array(4)
            .fill(0)
            .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
            .join("-");
    }
    loop() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const newTime = performance.now();
        const deltaTime = (newTime - this.time) / 1000;
        this.time = newTime;
        if (document.hasFocus()) {
            for (let i = this.toaster.length - 1; i >= 0; i--) {
                if (((_a = this.toaster[i]) === null || _a === void 0 ? void 0 : _a.duration) && ((_b = this.toaster[i]) === null || _b === void 0 ? void 0 : _b.duration) !== Infinity) {
                    this.toaster[i].duration -= deltaTime;
                    if (this.toaster[i].timer) {
                        const scale = this.toaster[i].duration / this.toaster[i].timerDuration;
                        if (this.toaster[i].timer === "vertical") {
                            this.toaster[i].timerEl.style.transform = `scaleY(${scale})`;
                        }
                        else {
                            this.toaster[i].timerEl.style.transform = `scaleX(${scale})`;
                        }
                    }
                    if (this.toaster[i].duration <= 0) {
                        this.toaster[i].el.remove();
                        this.toaster.splice(i, 1);
                    }
                }
            }
            if (this.snackbarQueue.length) {
                if (!((_d = (_c = this.snackbarQueue) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.el)) {
                    this.snackbarQueue[0].el = new SnackbarComponent(this.snackbarQueue[0]);
                    document.body.appendChild(this.snackbarQueue[0].el);
                }
                if (((_e = this.snackbarQueue[0]) === null || _e === void 0 ? void 0 : _e.duration) && ((_f = this.snackbarQueue[0]) === null || _f === void 0 ? void 0 : _f.duration) !== Infinity && ((_h = (_g = this.snackbarQueue[0]) === null || _g === void 0 ? void 0 : _g.el) === null || _h === void 0 ? void 0 : _h.isConnected)) {
                    this.snackbarQueue[0].duration -= deltaTime;
                    if (this.snackbarQueue[0].duration <= 0) {
                        this.snackbarQueue[0].el.remove();
                        this.snackbarQueue.splice(0, 1);
                    }
                }
            }
        }
        window.requestAnimationFrame(this.loop.bind(this));
    }
    snackbar(settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const snackbar = {};
        if (!(settings === null || settings === void 0 ? void 0 : settings.message) || ((_a = settings === null || settings === void 0 ? void 0 : settings.message) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            console.error("Snackbar notificaitons require a message");
            return;
        }
        snackbar.message = settings.message;
        snackbar.uid = this.uid();
        snackbar.el = null;
        let classes = [];
        if (settings === null || settings === void 0 ? void 0 : settings.classes) {
            if (Array.isArray(settings.classes)) {
                classes = settings.classes;
            }
            else {
                classes = [settings.classes];
            }
        }
        snackbar.classes = classes;
        if (typeof (settings === null || settings === void 0 ? void 0 : settings.duration) === "number" || (settings === null || settings === void 0 ? void 0 : settings.duration) === Infinity) {
            snackbar.duration = settings.duration;
        }
        else {
            snackbar.duration = 3;
        }
        if (typeof (settings === null || settings === void 0 ? void 0 : settings.closeable) !== "undefined" && typeof (settings === null || settings === void 0 ? void 0 : settings.closeable) === "boolean") {
            snackbar.closeable = settings === null || settings === void 0 ? void 0 : settings.closeable;
        }
        else {
            snackbar.closeable = true;
        }
        if (typeof (settings === null || settings === void 0 ? void 0 : settings.force) !== "undefined" && typeof (settings === null || settings === void 0 ? void 0 : settings.force) === "boolean") {
            snackbar.force = settings === null || settings === void 0 ? void 0 : settings.force;
        }
        else {
            snackbar.force = false;
        }
        if (typeof (settings === null || settings === void 0 ? void 0 : settings.autofocus) !== "undefined" && typeof (settings === null || settings === void 0 ? void 0 : settings.autofocus) === "boolean") {
            snackbar.autofocus = settings.autofocus;
        }
        else {
            snackbar.autofocus = true;
        }
        let buttons = [];
        if (settings === null || settings === void 0 ? void 0 : settings.buttons) {
            if (Array.isArray(settings.buttons)) {
                buttons = settings.buttons;
            }
            else {
                buttons = [settings.buttons];
            }
        }
        snackbar.buttons = buttons;
        for (let i = 0; i < snackbar.buttons.length; i++) {
            if ((_b = snackbar.buttons[i]) === null || _b === void 0 ? void 0 : _b.classes) {
                if (Array.isArray(snackbar.buttons[i].classes)) {
                    snackbar.buttons[i].classes = snackbar.buttons[i].classes;
                }
                else {
                    snackbar.buttons[i].classes = [snackbar.buttons[i].classes];
                }
            }
            else {
                snackbar.buttons[i].classes = [];
            }
            if (!((_c = snackbar.buttons[i]) === null || _c === void 0 ? void 0 : _c.ariaLabel)) {
                snackbar.buttons[i].ariaLabel = null;
            }
            if (!((_d = snackbar.buttons[i]) === null || _d === void 0 ? void 0 : _d.label)) {
                console.error("Snackbar buttons require a label");
                snackbar.buttons[i].label = null;
            }
            if (!((_e = snackbar.buttons[i]) === null || _e === void 0 ? void 0 : _e.callback)) {
                console.error("Snackbar buttons require a callback function");
                snackbar.buttons[i].callback = () => { };
            }
            if (!((_f = snackbar.buttons[i]) === null || _f === void 0 ? void 0 : _f.autofocus)) {
                snackbar.buttons[i].autofocus = false;
            }
            else {
                snackbar.autofocus = false;
            }
        }
        if (snackbar.force && this.snackbarQueue.length) {
            if ((_h = (_g = this.snackbarQueue[0]) === null || _g === void 0 ? void 0 : _g.el) === null || _h === void 0 ? void 0 : _h.isConnected) {
                this.snackbarQueue[0].el.remove();
            }
            this.snackbarQueue.splice(0, 1, snackbar);
        }
        else {
            this.snackbarQueue.push(snackbar);
        }
    }
    toast(settings) {
        var _a, _b, _c, _d, _e, _f, _g;
        const toast = {};
        if (!(settings === null || settings === void 0 ? void 0 : settings.message) || ((_a = settings === null || settings === void 0 ? void 0 : settings.message) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            console.error("Toast notificaitons require a message");
            return;
        }
        else if (!(settings === null || settings === void 0 ? void 0 : settings.title) || ((_b = settings === null || settings === void 0 ? void 0 : settings.title) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            console.error("Toast notificaitons require a title");
            return;
        }
        toast.title = settings.title;
        toast.message = settings.message;
        toast.uid = this.uid();
        let classes = [];
        if (settings === null || settings === void 0 ? void 0 : settings.classes) {
            if (Array.isArray(settings.classes)) {
                classes = settings.classes;
            }
            else {
                classes = [settings.classes];
            }
        }
        toast.classes = classes;
        if (typeof (settings === null || settings === void 0 ? void 0 : settings.duration) === "number" || (settings === null || settings === void 0 ? void 0 : settings.duration) === Infinity) {
            toast.duration = settings.duration;
        }
        else {
            toast.duration = 3;
        }
        if (typeof (settings === null || settings === void 0 ? void 0 : settings.closeable) !== "undefined" && typeof (settings === null || settings === void 0 ? void 0 : settings.closeable) === "boolean") {
            toast.closeable = settings.closeable;
        }
        else {
            toast.closeable = true;
        }
        if ((settings === null || settings === void 0 ? void 0 : settings.icon) && typeof (settings === null || settings === void 0 ? void 0 : settings.icon) === "string") {
            toast.icon = settings.icon;
        }
        else {
            toast.icon = null;
        }
        if (typeof (settings === null || settings === void 0 ? void 0 : settings.autofocus) !== "undefined" && typeof (settings === null || settings === void 0 ? void 0 : settings.autofocus) === "boolean") {
            toast.autofocus = settings.autofocus;
        }
        else {
            toast.autofocus = false;
        }
        let buttons = [];
        if (settings === null || settings === void 0 ? void 0 : settings.buttons) {
            if (Array.isArray(settings.buttons)) {
                buttons = settings.buttons;
            }
            else {
                buttons = [settings.buttons];
            }
        }
        toast.buttons = buttons;
        for (let i = 0; i < toast.buttons.length; i++) {
            if ((_c = toast.buttons[i]) === null || _c === void 0 ? void 0 : _c.classes) {
                if (Array.isArray(toast.buttons[i].classes)) {
                    toast.buttons[i].classes = toast.buttons[i].classes;
                }
                else {
                    toast.buttons[i].classes = [toast.buttons[i].classes];
                }
            }
            else {
                toast.buttons[i].classes = [];
            }
            if (!((_d = toast.buttons[i]) === null || _d === void 0 ? void 0 : _d.ariaLabel)) {
                toast.buttons[i].ariaLabel = null;
            }
            if (!((_e = toast.buttons[i]) === null || _e === void 0 ? void 0 : _e.label)) {
                console.error("Toaster buttons require a label");
                toast.buttons[i].label = null;
            }
            if (!((_f = toast.buttons[i]) === null || _f === void 0 ? void 0 : _f.callback)) {
                console.error("Toaster buttons require a callback function");
                toast.buttons[i].callback = () => { };
            }
            if (!((_g = toast.buttons[i]) === null || _g === void 0 ? void 0 : _g.autofocus)) {
                toast.buttons[i].autofocus = false;
            }
            else {
                toast.autofocus = false;
            }
        }
        if ((settings === null || settings === void 0 ? void 0 : settings.timer) && toast.duration !== Infinity) {
            if (settings.timer === "vertical" || settings.timer === "horizontal") {
                toast.timer = settings.timer;
            }
            else {
                console.error("Toaster timer value only accpets 'vertical' or 'horizontal'");
                toast.timer = null;
            }
            toast.timerDuration = toast.duration;
        }
        else {
            toast.timer = null;
        }
        toast.el = new ToastComponent(toast);
        if (toast.timer) {
            toast.timerEl = toast.el.querySelector("toast-timer");
        }
        this.toaster.push(toast);
        let shell = document.body.querySelector("toaster-component") || null;
        if (!shell) {
            shell = document.createElement("toaster-component");
            document.body.appendChild(shell);
        }
        shell.appendChild(toast.el);
    }
}

const globalNotifier = new Notifier();
const snackbar = globalNotifier.snackbar.bind(globalNotifier);
const toast = globalNotifier.toast.bind(globalNotifier);
customElements.define("snackbar-component", SnackbarComponent);
customElements.define("toast-component", ToastComponent);

export { Notifier, snackbar, toast };
