export type InboxEvent = {
    data: any;
    replyId: string|null;
}

export type Message = {
    recipient: string;
    data: any;
    maxAttempts?: number;
    senderId?: string;
};

export type ReplyMessage = {
    data: any;
    senderId?: string;
}

declare const register: (alias:string, inbox:Function) => string;
declare const unregister: (inboxId:string) => void;
declare const message: (messsage:{
    recipient: string;
    data: any;
    maxAttempts?: number;
    senderId?: string;
}) => void;
declare const reply: (replyId:string, message:ReplyMessage) => void;