# Super Components

Give your Web Components modern-day superpowers:

- create stateful web components similar to [React](https://github.com/facebook/react/)
- manage your components state with an [xstate](https://github.com/davidkpiano/xstate) inspired state machine
- bring your own client-side rendering framework/library such as [lit-html](https://lit-html.polymer-project.org/guide)
- supported in every major current browser

## Installation

Install via NPM

```bash
npm i -S @codewithkyle/supercomponent
```

Install via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@codewithkyle/supercomponent@1.0.0/supercomponent.min.js"></script>
```

```javascript
import SuperComponent from "https://cdn.jsdelivr.net/npm/@codewithkyle/supercomponent@1.0.0/supercomponent.min.mjs";
```

## Usage

```typescript
import SuperComponent from "@codewithkyle/supercomponent";

type ExampleModel = {
    products: Array<any>;
}
class Example extends SuperComponent<ExampleModel>{
    constructor(){
        super();
        this.state = "LOADING";
        this.stateMachine = {
            LOADING: {
                SUCCESS: "IDLING",
                ERROR: "ERROR",
            },
            IDLING: {
                TOGGLE: "LOADING",
            }
        }
        this.model = {
            products: [],
        };
    }

    async connected(){
        const request = await fetch("/products.json");
        if (request.ok){
            const response = await request.json();

            // Updates the model -- accepts a ExampleModel or Partial<ExampleModel> object
            this.update({ products: response });

            // Trigger a state transition
            this.trigger("SUCCESS");
        } else {
            this.trigger("ERROR");
        }
    }

    disconnected() {
        // Do something when the component disconnects from the DOM
    }

    updated(){
        // Do something after the model updates
    }

    render(){
        // Render this component model using whatever client-side UI framework you prefer
        switch (this.state){
            case "ERROR":
                // Render error message
                break;
            case "IDLING":
                // Render products
                break;
            default:
                // Render loading animation
                break;
        }
    }
}
customElements.define("example-component", Example);
```