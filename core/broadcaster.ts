/// <reference path="./messages.d.ts" />

import { uuid } from './env';

type Inbox = {
    callback: Function,
    disconnected?: boolean,
    uid: string,
}

class Broadcaster
{
    private worker : Worker;
    private inboxes : Array<Inbox>;
    private messageQueue : Array<BroadcastWorkerMessage>;
    private state : {
        allowMessaging: boolean,
    };

    constructor()
    {
        this.worker = new Worker(`${ window.location.origin }/assets/broadcast-worker.js`);
        this.worker.onmessage = this.handleMessage.bind(this);
        this.inboxes = [];
        this.messageQueue = [];
        this.state = {
            allowMessaging: false,
        };
    }

    /**
     * Set the broadcasters `workerReady` state to `true` and flush any queued messages.
     */
    private flushMessageQueue() : void
    {
        this.state.allowMessaging = true;
        if (this.messageQueue.length)
        {
            for (let i = 0; i < this.messageQueue.length; i++)
            {
                this.worker.postMessage(this.messageQueue[i]);
            }
        }
        this.messageQueue = [];
    }

    private sendDataToInboxes(inboxIndexes:Array<number>, data:MessageData) : void
    {
        for (let i = 0; i < inboxIndexes.length; i++)
        {
            try
            {
                this.inboxes[inboxIndexes[i]].callback(data);
            }
            catch (error)
            {
                this.disconnectInbox(this.inboxes[inboxIndexes[i]], inboxIndexes[i]);
            }
        }
    }

    /**
     * Broadcaster received a message from another thread.
     * This method is an alias of `this.worker.onmessage`
     */
    private handleMessage(e:MessageEvent) : void
    {
        const data = e.data;
        if (data.recipient?.trim().toLowerCase() === 'broadcaster')
        {
            this.inbox(data.data);
        }
        else
        {
            this.sendDataToInboxes(data.inboxIndexes, data.data);
        }
    }

    private sendUserDeviceInformation() : void
    {
        // @ts-ignore
        const deviceMemory = window.navigator?.deviceMemory ?? 8;
        const isSafari = (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0);
        const workerMessage:BroadcastWorkerMessage = {
            recipient: 'broadcast-worker',
            messageId: null,
            protocol: 'UDP',
            data: {
                type: 'init',
                memory: deviceMemory,
                isSafari: isSafari,
            },
        };
        this.postMessageToWorker(workerMessage);
    }

    /**
     * The broadcaster's personal inbox.
     */
    private inbox(data:MessageData) : void
    {
        const { type } = data;
        switch (type)
        {
            case 'ready':
                this.flushMessageQueue();
                this.sendUserDeviceInformation();
                break;
            case 'cleanup':
                this.cleanup();
                break;
            case 'ping':
                break;
            default:
                console.warn(`Unknown broadcaster message type: ${ data.type }`);
                break;
        }
    }

    /**
     * Sends a message to an inbox.
     * @param recipient - the name of the inboxes you want to send a message to
     * @param data - the `MessageData` object that will be sent to the inboxes
     * @param protocol - `UDP` will attempt to send the message but will not guarantee it arrives, `TCP` will attempt to deliver the message until the `maxAttempts` have been exceeded
     * @param maxAttempts - the maximum number of attempts before the `TCP` message is dropped
     */
    public message(recipient:string, data:MessageData, protocol:'UDP'|'TCP' = 'UDP', maxAttempts:number = 100) : void
    {
        const workerMessage:BroadcastWorkerMessage = {
            recipient: recipient,
            data: data,
            messageId: uuid(),
            protocol: protocol,
        };
        if (protocol === 'TCP')
        {
            workerMessage.maxAttempts = maxAttempts;
        }
        this.postMessageToWorker(workerMessage);
    }

    /**
     * Register and hookup an inbox.
     * @param name - the name of the inbox
     * @param inbox - the function that will handle the inboxes incoming messages
     */
    public hookup(name:string, inbox:Function) : string
    {
        const newInbox:Inbox = {
            callback: inbox,
            uid: uuid(),
        };
        const address = this.inboxes.length;
        this.inboxes.push(newInbox);
        const workerMessage:BroadcastWorkerMessage = {
            recipient: 'broadcast-worker',
            messageId: null,
            protocol: 'UDP',
            data: {
                type: 'hookup',
                name: name,
                inboxAddress: address,
            },
        };
        this.postMessageToWorker(workerMessage);
        return newInbox.uid;
    }

    /**
     * Sends a message to the worker using `postMessage()` or queues the message if the worker isn't ready.
     * @param message - the `BroadcastWorkerMessage` object that will be sent
     */
    private postMessageToWorker(message:BroadcastWorkerMessage) : void
    {
        if (this.state.allowMessaging)
        {
            this.worker.postMessage(message);
        }
        else
        {
            this.messageQueue.push(message);
        }
    }

    private cleanup() : void
    {
        this.state.allowMessaging = false;
        const updatedAddresses = [];
        const updatedInboxes = [];
        for (let i = 0; i < this.inboxes.length; i++)
        {
            const inbox = this.inboxes[i];
            if (!inbox?.disconnected)
            {
                const addressUpdate = {
                    oldAddressIndex: i,
                    newAddressIndex: updatedInboxes.length
                };
                updatedInboxes.push(inbox);
                updatedAddresses.push(addressUpdate);
            }
        }
        this.inboxes = updatedInboxes;
        const workerMessage:BroadcastWorkerMessage = {
            recipient: 'broadcast-worker',
            messageId: null,
            protocol: 'UDP',
            data: {
                type: 'update-addresses',
                addresses: updatedAddresses,
            },
        };
        this.worker.postMessage(workerMessage);
    }

    /**
     * Disconnect an inbox.
     * @param inboxId - the unique ID of the inbox
     */
    public disconnect(inboxId:string) : void
    {
        for (let i = 0; i < this.inboxes.length; i++)
        {
            const inbox = this.inboxes[i];
            if (inbox.uid === inboxId)
            {
                this.disconnectInbox(inbox, i);
                break;
            }
        }
    }

    private disconnectInbox(inbox:Inbox, index:number) : void
    {
        inbox.disconnected = true;
        inbox.callback = ()=>{};
        const workerMessage:BroadcastWorkerMessage = {
            recipient: 'broadcast-worker',
            messageId: null,
            protocol: 'UDP',
            data: {
                type: 'disconnect',
                inboxAddress: index,
            },
        };
        this.postMessageToWorker(workerMessage);
    }
}

export const broadcaster:Broadcaster = new Broadcaster();