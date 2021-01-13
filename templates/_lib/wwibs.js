/**
 * Quick and dirty unique ID generation.
 * This method does not follow RFC 4122 and does not guarantee a universally unique ID.
 * @see https://tools.ietf.org/html/rfc4122
 */
function uuid() {
    return new Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
        .join("-");
}

const VERSION = "0.1.2";
class Broadcaster {
    constructor() {
        this.worker;
        this.setupBroadcastWorker();
        this.inboxes = [];
        this.messageQueue = [];
        this.state = {
            allowMessaging: false,
        };
        window.addEventListener("unload", () => {
            const workerMessage = {
                recipient: "broadcast-worker",
                data: {
                    type: "unload",
                },
            };
            this.worker.postMessage(workerMessage);
        });
    }
    async setupBroadcastWorker() {
        let request = await fetch(`https://cdn.jsdelivr.net/npm/wwibs@${VERSION}/wwibs-worker.min.js`);
        let url;
        if (request.ok) {
            const response = await request.blob();
            url = URL.createObjectURL(response);
        }
        else {
            request = await fetch("/wwibs-worker.min.js");
            if (request.ok) {
                const response = await request.blob();
                url = URL.createObjectURL(response);
            }
            else {
                console.error(`Failed to fetch the Inbox Worker from the CDN and ${location.origin}.`);
            }
        }
        if (url) {
            this.worker = new Worker(url);
            this.worker.onmessage = this.handleWorkerMessage.bind(this);
        }
    }
    /**
     * Set the broadcasters `workerReady` state to `true` and flush any queued messages.
     */
    flushMessageQueue() {
        this.state.allowMessaging = true;
        if (this.messageQueue.length) {
            for (let i = 0; i < this.messageQueue.length; i++) {
                this.worker.postMessage(this.messageQueue[i]);
            }
        }
        this.messageQueue = [];
    }
    sendDataToInboxes(inboxIndexes, data) {
        for (let i = 0; i < inboxIndexes.length; i++) {
            try {
                this.inboxes[inboxIndexes[i]].callback(data);
            }
            catch (error) {
                this.disconnectInbox(this.inboxes[inboxIndexes[i]], inboxIndexes[i]);
            }
        }
    }
    /**
     * Broadcaster received a message from the Inbox worker.
     * This method is an alias of `this.worker.onmessage`
     */
    handleWorkerMessage(e) {
        var _a;
        const data = e.data;
        if (((_a = data.recipient) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === "broadcaster") {
            this.inbox(data.data);
        }
        else {
            this.sendDataToInboxes(data.inboxIndexes, data.data);
        }
    }
    sendUserDeviceInformation() {
        var _a, _b;
        // @ts-ignore
        const deviceMemory = (_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.deviceMemory) !== null && _b !== void 0 ? _b : 8;
        const isSafari = navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0;
        const workerMessage = {
            senderId: null,
            recipient: "broadcast-worker",
            messageId: null,
            maxAttempts: 1,
            data: {
                type: "init",
                memory: deviceMemory,
                isSafari: isSafari,
            },
        };
        this.postMessageToWorker(workerMessage);
    }
    /**
     * The broadcaster's personal inbox.
     */
    inbox(data) {
        const { type } = data;
        switch (type) {
            case "worker-ready":
                this.flushMessageQueue();
                this.sendUserDeviceInformation();
                break;
            case "cleanup-complete":
                this.state.allowMessaging = true;
                this.flushMessageQueue();
                break;
            case "cleanup":
                this.cleanup();
                break;
            case "ping":
                break;
            default:
                console.warn(`Unknown broadcaster message type: ${data.type}`);
                break;
        }
    }
    /**
     * Sends a message to an inbox.
     */
    message(data) {
        var _a, _b, _c;
        const message = {
            recipient: data.recipient,
            type: data.type,
            data: (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : {},
            senderId: (_b = data === null || data === void 0 ? void 0 : data.senderId) !== null && _b !== void 0 ? _b : null,
            maxAttempts: (_c = data === null || data === void 0 ? void 0 : data.maxAttempts) !== null && _c !== void 0 ? _c : 1,
            messageId: uuid(),
        };
        this.postMessageToWorker(message);
    }
    /**
     * Register and hookup an inbox.
     * @param name - the name of the inbox
     * @param inbox - the function that will handle the inboxes incoming messages
     * @returns inbox UID
     */
    hookup(name, inbox) {
        const newInbox = {
            callback: inbox,
            uid: uuid(),
        };
        const address = this.inboxes.length;
        this.inboxes.push(newInbox);
        const workerMessage = {
            senderId: newInbox.uid,
            recipient: "broadcast-worker",
            messageId: null,
            maxAttempts: 1,
            data: {
                type: "hookup",
                name: name,
                inboxAddress: address,
                uid: newInbox.uid,
            },
        };
        this.postMessageToWorker(workerMessage);
        return newInbox.uid;
    }
    /**
     * Disconnect an inbox.
     * @param inboxId - the UID of the inbox
     */
    disconnect(inboxId) {
        for (let i = 0; i < this.inboxes.length; i++) {
            const inbox = this.inboxes[i];
            if (inbox.uid === inboxId) {
                this.disconnectInbox(inbox, i);
                break;
            }
        }
    }
    /**
     * Send a reply message.
     */
    reply(data) {
        var _a, _b, _c;
        const message = {
            replyId: data.replyId,
            type: data.type,
            data: (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : {},
            senderId: (_b = data === null || data === void 0 ? void 0 : data.senderId) !== null && _b !== void 0 ? _b : null,
            maxAttempts: (_c = data === null || data === void 0 ? void 0 : data.maxAttempts) !== null && _c !== void 0 ? _c : 1,
            messageId: uuid(),
        };
        this.postMessageToWorker(message);
    }
    /**
     * Send a reply to the sender and all original recipients.
     */
    replyAll(data) {
        var _a, _b, _c;
        const message = {
            replyId: data.replyId,
            type: data.type,
            data: (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : {},
            senderId: (_b = data === null || data === void 0 ? void 0 : data.senderId) !== null && _b !== void 0 ? _b : null,
            maxAttempts: (_c = data === null || data === void 0 ? void 0 : data.maxAttempts) !== null && _c !== void 0 ? _c : 1,
            messageId: uuid(),
            replyAll: true,
        };
        this.postMessageToWorker(message);
    }
    disconnectInbox(inbox, index) {
        inbox.disconnected = true;
        inbox.callback = () => { };
        const workerMessage = {
            senderId: null,
            recipient: "broadcast-worker",
            messageId: null,
            maxAttempts: 1,
            data: {
                type: "disconnect",
                inboxAddress: index,
            },
        };
        this.postMessageToWorker(workerMessage);
    }
    /**
     * Sends a message to the worker using `postMessage()` or queues the message if the worker isn't ready.
     * @param message - the `BroadcastWorkerMessage` object that will be sent
     */
    postMessageToWorker(message) {
        if (this.state.allowMessaging) {
            this.worker.postMessage(message);
        }
        else {
            this.messageQueue.push(message);
        }
    }
    cleanup() {
        this.state.allowMessaging = false;
        const updatedAddresses = [];
        const updatedInboxes = [];
        for (let i = 0; i < this.inboxes.length; i++) {
            const inbox = this.inboxes[i];
            if (!(inbox === null || inbox === void 0 ? void 0 : inbox.disconnected)) {
                const addressUpdate = {
                    oldAddressIndex: i,
                    newAddressIndex: updatedInboxes.length,
                };
                updatedInboxes.push(inbox);
                updatedAddresses.push(addressUpdate);
            }
        }
        this.inboxes = updatedInboxes;
        const workerMessage = {
            senderId: null,
            recipient: "broadcast-worker",
            messageId: null,
            maxAttempts: 1,
            data: {
                type: "update-addresses",
                addresses: updatedAddresses,
            },
        };
        this.worker.postMessage(workerMessage);
    }
}

let script = document.head.querySelector("script#broadcaster") || null;
if (!script) {
    script = document.createElement("script");
    script.id = "broadcaster";
    script.innerHTML =
        "window.globalManager = null;window.globalMessage = null;window.globalHookup = null;window.globalDisconnect = null;window.globalReply = null;window.globalReplyAll = null;";
    document.head.appendChild(script);
    // @ts-ignore
    globalManager = new Broadcaster();
}
// @ts-ignore
globalMessage = globalManager.message.bind(globalManager);
/**
 * Sends a message to an inbox.
 */
// @ts-ignore
const message = globalMessage;
// @ts-ignore
globalHookup = globalManager.hookup.bind(globalManager);
/**
 * Register and hookup an inbox.
 * @param name - the name of the inbox
 * @param inbox - the function that will handle the inboxes incoming messages
 * @returns inbox UID
 */
// @ts-ignore
const hookup = globalHookup;
// @ts-ignore
globalDisconnect = globalManager.disconnect.bind(globalManager);
/**
 * Disconnect an inbox.
 * @param inboxId - the UID of the inbox
 */
// @ts-ignore
const disconnect = globalDisconnect;
// @ts-ignore
globalReply = globalManager.reply.bind(globalManager);
/**
 * Send a reply message.
 */
// @ts-ignore
const reply = globalReply;
// @ts-ignore
globalReplyAll = globalManager.replyAll.bind(globalManager);
/**
 * Send a reply to the sender and all original recipients.
 */
// @ts-ignore
const replyAll = globalReplyAll;

export { disconnect, hookup, message, reply, replyAll };
