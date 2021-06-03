# Actor Model Messaging

A lightweight (1.2kb) Actor Model messaging library for the web.

## Install

Install via NPM:

```bash
npm i -S @codewithkyle/messaging
```

Or via CDN:

```javascript
import { register, unregister, message, reply } from "https://cdn.jsdelivr.net/npm/@codewithkyle/messaging@1/messaging.min.mjs";
```

```html
<script src="https://cdn.jsdelivr.net/npm/@codewithkyle/messaging@1/messaging.min.js">
```

## Usage

```typescript
import { register, unregister, message, reply } from "https://cdn.jsdelivr.net/npm/@codewithkyle/messaging@1/messaging.min.mjs";

const inbox = (e:InboxEvent) => {
    const { data, replyId } = e;
    console.log(data);
    reply({
        replyId: replyId,
        data: "this is a reply"
    });
}
const inboxId = register("my-cool-inbox", inbox);
setTimeout(() => {
    message({
        recipient: "my-cool-inbox",
        data: "hello world",
        maxAttempts: 10,
    });
}, 1000);
setTimeout(() => {
    unregister(inboxId);
}, 2000);
```

## Interfaces

```typescript
interface InboxEvent {
    data: any;
    replyId: string|null;
}

interface Message {
    recipient: string;
    data: any;
    maxAttempts?: number;
    senderId?: string;
};

interface ReplyMessage {
    data: any;
    senderId?: string;
}
```
