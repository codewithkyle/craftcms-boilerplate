# PubSub

A lightweight (1kb) pubsub JavaScript library.

## Installation

Install via NPM

```bash
npm i -S @codewithkyle/pubsub
```

Install via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@codewithkyle/pubsub@1/pubsub.min.js"></script>
```

```javascript
import { EventBus, createSubscription, destroySubscription, publish, subscribe, unsubscribe } from "https://cdn.jsdelivr.net/npm/@codewithkyle/pubsub@1/pubsub.min.mjs";
```

## Usage

### ES Modules

```typescript
import { createSubscription, destroySubscription, publish, subscribe, unsubscribe } from "https://cdn.jsdelivr.net/npm/@codewithkyle/pubsub@1/pubsub.min.mjs";
const ticket = createSubscription();
const inbox = (data:any) => {
    console.log(data);
};
const inboxId = subscribe(ticket, inbox);
setTimeout(()=>{
    publish(ticket, "Hello world");
}, 1000);
```

### Vanilla JS

```javascript
const ticket = EventBus.createSubscription();
const inbox = (data:any) => {
    console.log(data);
};
const inboxId = EventBus.subscribe(ticket, inbox);
setTimeout(()=>{
    EventBus.publish(ticket, "Hello world");
}, 1000);
```
