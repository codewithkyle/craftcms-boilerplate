# Craft CMS Boilerplate

A Craft CMS boilerplate utilizing JIT resource fetching, critical CSS injection, offline first resource strategy, offline fallback page caching, and context-specific progressive enhancements. The goal of this boilerplate is to provide developers with a sturdy foundation to build upon, the client a high performant website, and the content editors a simple and rich experience.

This boilerplate is built around the idea that one matrix field can be used to create a dynamic page builder. It uses the [Matrix Mate](https://plugins.craftcms.com/matrixmate) and [Smith](https://plugins.craftcms.com/smith) plugins to provide an organized and customized content editing experience. Designs should be split into blocks and added to the page builder matrix field.

## Key Beliefs

- Blocks should follow the KISS principle (keep it stupid simple)
	- Use Matrix Mate to group fields within a block
	- Use Matrix Mate to group blocks into intuitive categories
- Blocks should be opinionated
	- Do not created "god" blocks that can do everything instead plan ahead by splitting the functionality into several smaller blocks
	- [Hicks Law](https://lawsofux.com/hicks-law) will be observed when creating blocks
- A website is a living project and as the clients needs change new blocks should be added
- Leverage the benefits of [modular programming](https://en.wikipedia.org/wiki/Modular_programming)
- Resources should only be loaded when they are needed (see [JINT Methodology](https://jintmethod.dev/))
- CSS requried to render the inital view will be included in the documents `<head>`
- CSS requried for client-side rendering or elements hidden behind an action will be lazy loaded
- The Service Worker will cache and respond with resouces (images, CSS, JS)
- The Service Worker will provide an offline page cache
- The Service Worker will provide an offline fallback page (`/offline`)

## Getting Started

Download the [latest release](https://github.com/codewithkyle/craftcms-boilerplate/releases) to get started.

### Requirements

-   Craft 3 [server requirements](https://docs.craftcms.com/v3/requirements.html)
-   [NodeJS >= v14](https://nodejs.org/en/)

### Recommended Additions

-   [Redis](https://redis.io/)

### First Time Setup

Run the setup command `npm run setup`

Open the generated `.env` file and input your environment details.

## Development

This boilerplate uses a handful of custom build tools.

- [Lazy Loader](https://github.com/codewithkyle/lazy-loader) is a lightweight JavaScript and CSS boostrapper built around Web Components.
- [Twist](https://github.com/codewithkyle/twist) is a simple build tool for managing your ES Module static import paths & transpiling your TypeScript files using [esbuild](https://esbuild.github.io/).
- [CSSMonster](https://github.com/codewithkyle/cssmonster) transpiles [SASS](https://sass-lang.com/) into CSS using [node-sass](https://github.com/sass/node-sass).
- [Brixi](https://brixi.dev/) is a lightweight utility-frist CSS framework.
- [Snowpack](https://www.snowpack.dev/) bundles NPM packages into ES Modules.

### Commands

```sh
# Development Build
npm run build

# Production Build
npm run production

# Generate Brixi CSS
npm run brixi

# Bundle NPM Packages into the templates/_lib/ directory
npm run bundle
```

### Writing Code

All TypeScript/JavaScript, CSS/SASS, and HTML/Twig should be written in the `templates/` directory. To keep everything organized follow these guidelines:

1. All directories and files must follow the kebab case format.
1. Group related files.
1. Code within a template directory should only be used on that template.

### Code Organization

In the example directory structure below a web component will be included in the template `custom-page`

```sh
custom-page
├── custom-component
│   ├── custom-component.scss
│   ├── custom-component.ts
│   └── index.twig
└── index.twig
```

In the example above we are locking the `custom-component` usage to the `custom-page` template. If `custom-component` is needed on several templates it should be relocated higher up within the `templates/` directory. The placement of files is irrelevant during the JavaScript/CSS build process allowing `custom-component` to be relocated at any time.

**Why?**

The organization of code is restricted as a measure of preventing breaking changes. Developers should not have to hunt through several directories to find the file they need to edit. Also when several developers work on the same project conflicts can arise when one developer includes a component from another template and the second developer is unaware of the include. If they make a change to the component for the original template it could break the component for the second template.

**So why not just test the pages?**

As sites grow it can be difficult and time-consuming to test every page and every possible combination of every page. It's much easier and faster to update a few `{% include %}` tags to point to a new location.

### Code Architecture

This boilerplate is build around the [model-view-viewmodel-controller software architecture pattern](https://mvvmc.jintmethod.dev/). For your convenience several custom import paths have been predefined in the `tsconfig.json` file.

1. Web Components can globally access controllers using the `controllers/` import.
1. Web Components can globally access 3rd party JavaScript libraries using the `lib/` import.
1. Web Components and Web Workers can globally access TypeScript definition files using the `types/` import.
