# Craft CMS Boilerplate

A Craft CMS boilerplate utilizing JIT resource fetching, offline first content strategy, context-specific progressive enhancements, and Pjax navigation. The goal of this boilerplate is to provide the developers with a sturdy foundation to build upon, the client an accessible and high performant website, and the content editors a simple and rich experience.

> **NOTICE:** This is an opinionated system. It is built around the idea that one matrix field can be used to create a dynamic page builder. It uses [Matrix Mate](https://plugins.craftcms.com/matrixmate) and the [Smith](https://plugins.craftcms.com/smith) plugins to provide an organized and customized content editing experience. Designs should be split into blocks and added to the content matrix field. When blocks become too complicated split them into several smaller/simpler blocks.

## Key Beliefs

-   The KISS principle (keep it stupid simple).
-   Design/blocks should be deliberate and opinionated.
-   Observe [Hicks Law](https://lawsofux.com/hicks-law) when creating blocks.

## Getting Started

Download the [latest release](https://github.com/codewithkyle/craftcms-boilerplate/releases) to get started.

### Requirements

-   Craft 3 [server requirements](https://docs.craftcms.com/v3/requirements.html)
-   [Redis](https://redis.io/)
-   [NodeJS >= v12](https://nodejs.org/en/)

### First Time Setup

Run the setup command `npm run setup`

Open the generated `.env` file and input your environment details.

## Development

This boilerplate uses a handful of custom build tools. Feel free to uninstall them and write your own.

-   [DjinnJS](https://djinnjs.com/) is an ES Module based JavaScript framework.
-   [CSSMonster](https://github.com/codewithkyle/cssmonster) transpiles [SASS](https://sass-lang.com/) into CSS using [node-sass](https://github.com/sass/node-sass).
-   [Brixi](https://github.com/codewithkyle/brixi) is a CSS variable based utility framework.
-   [Snowpack](https://www.snowpack.dev/) bundles NPM packages into ES Modules.

### Commands

```sh
# Development Build
npm run build

# Production Build
npm run production

# Generate Brixi CSS
npm run brixi

# Bundle NPM Packages
npm run bundle
```

### Writing Code

All TypeScript/JavaScript, CSS/SASS, and HTML/Twig should be written in the `templates/` directory. To keep everything organized follow these guidelines:

1. All directories and files must follow the kebab case format.
1. Related must be siblings within their directory.
1. Code within a directory should only be used within the directory.

### Code Organization

In the example below a web component will be included in a template. Below is an example directory structure.

```sh
custom-page
├── custom-component
│   ├── custom-component.scss
│   ├── custom-component.ts
│   └── index.twig
└── index.twig
```

Using the example above we are locking the `custom-component` usage to only the `custom-page` template. If `custom-component` is needed on several templates it should be relocated higher up within the `templates/` directory. The placement of files is irrelevant during the JavaScript/CSS build process allowing `custom-component` to be relocated at any time.

**Why?**

The organization of code is restricted as a measure of preventing breaking changes. Developers should not have to hunt through several directories to find the file they need to edit. Also when several developers work on the same project conflicts can arise when one developer includes a component from another template and the second developer is unaware of the include. If they make a change to the component for the original template it could break the component for the second template.

**So why not just test the pages?**

As sites grow it can be difficult and time-consuming to test every page and every possible combination of every page. It's much easier and faster to update a few `{% include %}` tags to point to a new location.
