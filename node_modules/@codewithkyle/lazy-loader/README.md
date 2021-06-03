# Lazy Loader

A lightweight (1.6kb) Web Component based lazy loading library.

## Install

Install via NPM:

```bash
npm i -S @codewithkyle/lazy-loader
```

Or via CDN:

```javascript
import { configure, update, mount, css } from "https://cdn.jsdelivr.net/npm/@codewithkyle/lazy-loader@1/lazy-loader.min.mjs";
```

```html
<script src="https://cdn.jsdelivr.net/npm/@codewithkyle/lazy-loader@1/lazy-loader.min.js">
```

## Usage

### ES Module

```typescript
import { configure, update, mount, css } from "https://cdn.jsdelivr.net/npm/@codewithkyle/lazy-loader@1/lazy-loader.min.mjs";

// Start the lazy loading process by configuring the default locations for your JS and CSS files
configure({
    jsDir: "/js",
    cssDir: "/css",
});

// Alternatively if the default settings (seen above) are okay you could simply call the update function instead
// You can call the update function at any time
update();

// Manually mount new components
import { MyCustomElement } from "./my-custom-element.js";
mount("my-custom-element", MyCustomElement); // returns a promise

// Alternatively if the components file name matches the tag name the library can dynamically import the script from the JS directory (see configure function)
mount("my-custom-element");

// Manually lazy load CSS files
css("exmaple.css"); // returns a promise

// Alternatively you can load multiple files at once
css(["example-one", "examle-two.css", "https://cdn.example.com/example-two.css", "../../relative-path-example.css"]);
```

### Common JS

```typescript
LazyLoader.configure({
    jsDir: "/",
    cssDir: "/",
});
LazyLoader.update();
LazyLoader.mount("my-custom-element")
```

### Interfaces

```typescript
type Loading = "eager" | "lazy";

interface LazyLoaderSettings {
    cssDir?: string;
    jsDir?: string;
};

declare const configure: (settings?:Partial<LazyLoaderSettings>) => void;
declare const update: () => void;
declare const mount: (tagName:string, constructor?: CustomElementConstructor) => Promise<void>;
declare const css: (files:string|string[]) => Promise<void>;
```

### HTML Attributes

```html
<!-- Lazy load Web Components by tagging custom elements with the web-component attribute. -->
<custom-element web-component></custom-element>

<!-- By default components are loaded and mounted when they enter the viewport. -->
<!-- You can bypass the lazy loader using the loading attribute. -->
<custom-element web-component loading="eager"></custom-element>

<!-- Lazy load CSS by attaching the css attribute to any element within the documents body. -->
<!-- You can load multiple files using a whitespace separator. The .css file extenstion is optional. -->
<div class="my-awesome-class" css="awesome-transitions awesome.css"></div>
```