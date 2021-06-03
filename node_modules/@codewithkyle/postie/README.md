# Postie

Postie helps you to perform simple CRUD operations using HTML Attributes. Postie is a smaller, simpler, version of [htmx](https://htmx.org/). If you need all the bells and whistles (like CSS transitions) I suggest you use the htmx library instead.

## Install

Install via NPM:

```bash
npm i -S @codewithkyle/postie
```

Or via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@codewithkyle/postie@1/postie.min.js">
```

## Usage

### Interfaces

```typescript
type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type AcceptHeader = "application/json" | "text/html";

type Prompt = "confirm" | "input" | null;

type Swap = "inner" | "outer" | "innerHTML" | "outerHTML";

interface PostieSettings {
    endpoint: string;
    method?: RequestMethod; // POST
    accept?: AcceptHeader; // application/json
    data?: DOMStringMap; // {}
    prompt?: Prompt; // null
    promptLabel?: string;
    promptValue?: string;
    promptName?: string; // prompt
    success?: string | null;
    error?: string | null;
    preventDisable?: boolean; // false
    once?: boolean; // false
    target?: string; // this.el
    swap?: Swap; // innerHTML
    reset?: number; // 10
};
```

### Postie Element Anatomy

```html
<!-- This is an HTML Element -->
<button></button>

<!-- This is a Postie HTML Element -->
<button postie></button>

<!-- These are the default HTML Attribute values -->
<button postie="idling" method="POST" accept="application/json" swap="innerHTML" reset="10" trigger="click"></button>

<!-- These are the required HTML Attributes -->
<button postie endpoint="/url/to/some/endpoint-or-page"></button>
```

### Examples

#### Request Method & Body Controls

```html
<!-- DELETE example -->
<button postie method="DELETE" endpoint="https://api.example.com/v1/user">Delete Account</button>

<!-- POST with data example: { "userId": "1234", "source": "demo" } -->
<button postie endpoint="https://api.example.com/v1/user/resend-verification" data-user-id="1234" data-source="demo">Resend Verification Email</button>
```

#### Handling Responses

```html
<!-- Success handling -->
<button postie onsuccess="location.href = '/';" method="DELETE" endpoint="https://api.example.com/v1/user">Delete Account</button>

<!-- Error handling -->
<button postie onerror="alert('Failed to delete account.');" method="DELETE" endpoint="https://api.example.com/v1/user">Delete Account</button>

<!-- application/json responses (default) injects a "response" object into the error/success callback script -->
<button postie onsuccess="console.log(response);" onerror="console.log(response);" method="DELETE" endpoint="https://api.example.com/v1/user">Delete Account</button>
```

#### Trigger Event Options

```html
<!-- Tell Postie to perform the action when the element is clicked (default) -->
<button postie trigger="click" method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>

<!-- Tell Postie to perform the action when the element enters the viewport (observe only fires once) -->
<button postie trigger="observe" method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>

<!-- Perform an action when the element has focus and the [key] is pressed -->
<button postie trigger="keypress" key="r" method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>
```

#### AJAX

```html
<!-- Fetch HTML and inject it into the element -->
<button postie method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>

<!-- Fetch HTML and inject it into another element using a selector string -->
<div id="target-element"></div>
<button postie method="GET" accept="text/html" endpoint="/ajax/demo.html" target="#target-element">AJAX</button>

<!-- Fetch HTML and replace the elements outerHTML -->
<button postie method="GET" accept="text/html" endpoint="/ajax/demo.html" swap="outerHTML">Hotswap Element</button>
```

#### User Prompts

```html
<!-- Prompt the user to confirm their action -->
<button postie prompt="confirm" prompt-label="Are you sure you want to delete your account? This action cannot be undone." method="DELETE" endpoint="https://api.example.com/v1/admin/user/1234" onsuccess="location.href = '/';" onerror="alert('Failed to delete account.');">Delete Account</button>

<!-- Prompt the user for an input before processing their action -->
<button postie prompt="input" prompt-label="Enter your password to confirm account deletion." method="DELETE" endpoint="https://api.example.com/v1/admin/user/1234" onsuccess="location.href = '/';" onerror="alert('Failed to delete account.');">Delete Account</button>

<!-- Control the prompts body param key: { "password": "" } -->
<button postie prompt-name="password" prompt="input" prompt-label="Enter your password to confirm account deletion." method="DELETE" endpoint="https://api.example.com/v1/admin/user/1234" onsuccess="location.href = '/';" onerror="alert('Failed to delete account.');">Delete Account</button>

<!-- Prefill the input prompts value -->
<button postie prompt-value="prefill prompt value" prompt-name="password" prompt="input" prompt-label="Enter your password to confirm account deletion." method="DELETE" endpoint="https://api.example.com/v1/admin/user/1234" onsuccess="location.href = '/';" onerror="alert('Failed to delete account.');">Delete Account</button>
```

#### Other Features

```html
<!-- Prevent Postie from applying the [disabled] attribute to the element -->
<button postie prevent-disable method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>
<button postie no-disable method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>

<!-- Stop Postie from preventing the default event behavior -->
<button postie allow-default method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>

<!-- Tell Postie the action can only be performed once -->
<button postie once method="GET" accept="text/html" endpoint="/ajax/demo.html">AJAX</button>

<!-- Change the reset timeout -- defaults to 10 (seconds) -->
<button postie reset="5" endpoint="https://api.example.com/v1/user/resend-verification" data-user-id="1234" data-source="demo">Resend Verification Email</button>
```

### Stateful Stylesheets

```scss
button{
    // Default postie element state.

    &[postie="processing"]{
        // Show a loading spinner or something.
    }

    &[postie="success"]{
        // Success!
    }

    &[postie="error"]{
        // Oh sh*t. Something bad happened.
    }

    &[disabled],
    &:disabled{
        // Postie disabled the element.
    }
}
```

### Custom Events

The Custom Event's `e.detail` value will contain the fetch request response. The value will be `null` if the `[accept]` attribute was changed to `text/html`

```typescript
document.addEventListener("postie:success", (e:CustomEvent) => {
    console.log(e.detail);
});
document.addEventListener("postie:error", (e:CustomEvent) => {
    console.error(e.detail);
    if (e.detail?.error){
        alert(e.detail.error);
    }
});
```

If you manually appended new elements with the `[trigger="observe"]` attribute you can tell Postie to update by dispatching a custom event on the document:

```typescript
const event = new CustomEvent("postie:update");
document.dispatchEvent(event);
```
