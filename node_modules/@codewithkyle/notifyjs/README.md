# Notify.js

Notify.js is a hyper-lightweight utility library for managing simple [snackbar](https://material.io/develop/web/components/snackbars/) and [toaster](https://www.carbondesignsystem.com/components/notification/code/) notifications.

## Installation

Download Notify.js via NPM:

```sh
npm i --save @codewithkyle/notifyjs
```

Or use the CDN version:

```javascript
import { Notifier, snackbar, toast } from "https://cdn.jsdelivr.net/npm/@codewithkyle/notifyjs@2.1.0/notify.min.mjs";
```

## Usage

1. [Notification Manager](#notification-manager)
1. [Global Notifications](#global-manager)
1. [Snackbar Notification](#snackbar-notification)
    1. [Snackbar Interface](#snackbar-interface)
    1. [Snackbar HTML Structure](#snackbar-html-structure)
1. [Toast Notification](#toast-notification)
    1. [Toast Interface](#toast-interface)
    1. [Toast HTML Structure](#toast-html-structure)

There are two ways to use this package. You can create a Notification Manager or use the global manager. Each manager has a queue and new notifications are placed in the queue in the order that they're requested. The queue can be skipped by settings the `force` value to true.

### Notification Manager

Import the manager:

```typescript
import { Notifier } from "@codewithkyle/notifyjs";
const notifier = new Notifier();
```

Create a snackbar or toast notification:

```typescript
notifier.snackbar({
    message: "All snackbar notifications require a message",
});
notifier.toast({
    title: "Toast notificaitons require a title",
    message: "And they require a message",
});
```

### Global Manager

Import the notification type:

```typescript
import { snackbar, toast } from "@codewithkyle/notifyjs";
```

Create a notification:

```typescript
snackbar({
    message: "All snackbar notifications require a message",
});
toast({
    title: "Toast notificaitons require a title",
    message: "And they require a message",
});

// Adds an action button
snackbar({
    message: "All snackbar notifications require a message",
    buttons: [
        {
            label: "Update",
            callback: () => {
                console.log("User clicked the update button");
            },
        },
    ],
});
```

---

## Snackbar Notification

Snackbar notifications are great for quick one-off notifications.

### Snackbar Interface 

```typescript
interface SnackbarNotification {
    message: string;
    duration?: number; // in seconds
    closeable?: boolean;
    buttons?: Array<{
        label: string;
        callback: Function;
        ariaLabel?: string;
        classes?: Array<string> | string;
        autofocus?: boolean;
    }>;
    force?: boolean;
    classes?: Array<string> | string;
    autofocus?: boolean;
}
```

### Snackbar HTML Structure

```html
<snackbar-component>
    <p>Custom notification message</p>
    <snackbar-actions>
        <button>Action</button>
        <button class="close">
            <svg />
        </button>
    </snackbar-actions>
</snackbar-component>
```

---

## Toast Notification

Toaster notifications are great for application-like notification systems where users will need to recieve warnings, updates, successes, and errors.

### Toast Interface 

```typescript
type ToasterNotification = {
    title: string;
    message: string;
    closeable?: boolean;
    icon?: string; // svg or img
    duration?: number; // in seconds
    classes?: string[];
    autofocus?: boolean;
    buttons?: Array<{
        label: string;
        callback: Function;
        ariaLabel?: string;
        classes?: Array<string> | string;
        autofocus?: boolean;
    }>;
    timer?: "vertical" | "horizontal";
};
```

### Toast HTML Structure

```html
<toaster-component>
    <toast-component>
        <i>
            <svg />
        </i>
        <copy-wrapper>
            <h3>Title</h3>
            <p>Custom notification message</p>
            <toast-actions>
                <button>Action</button>
            </toast-actions>
        </copy-wrapper>
        <button class="close">
            <svg />
        </button>
        <toast-timer class="vertical || horizontal"></toast-timer>
    </toast-component>
</toaster-component>
```
