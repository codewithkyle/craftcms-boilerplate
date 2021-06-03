# Twist

A simple build tool for wrangling your ES Module static import paths.

## Install

```bash
npm i -S @codewithkyle/twist
```

## Usage

By default we will look for JavaScript/TypeScript files in the `src/` directory and will output to the `public/js` directory. If you do not provide a `--config` flag we will use the esbuild options displayed in the example below.

```json
// package.json
{
    "scripts": {
        "build": "twist --src=./path-to/source --outdir=./public/js --config=./esbuild.config.js"
    }
}
```

```javascript
// esbuild.config.js -- https://esbuild.github.io/api/
module.exports = {
    bundle: false,
    minify: true,
    format: "esm",
    target: "es2020",
}
```

## Limit Breaking Changes

This project uses [esbuild](https://github.com/evanw/esbuild) as a dependency. Esbuild has **NOT** shipped a v1.0.0 meaning that minor releases of their library can contain breaking changes.

### What does this mean for anyone using this library?

It means that minor releases for this library may contain an esbuild update that introduces breaking changes.

### How to avoid breaking changes?

**Option 1:** install [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), or [esbuild](https://esbuild.github.io/) yourself and use the `--skip-build` flag. Then all you need to do is make sure the compiler you've selected runs first, then point the `--src` path to the compiler's JavaScript output directory.

**Option 2:** Accept that esbuild is under development and try to limit your use of their experimental build tools or API features. Also, thoroughly test everything whenever you update your NPM packages.

**Option 3:** Make sure this library does not contain the `^` character in the version number within your `package.json` file. This will force NPM to download the specified version instead of downloading the latest version whenever you perform the `npm update` or `npm install` commands. When you need to update this library you will need to manually adjust the library's version number within your `packages.json` file after reading through the [our changelog](https://github.com/codewithkyle/twist/blob/master/CHANGELOG.md) looking for esbuild updates. Before you update we suggest you need to read through the [esbuild changelog](https://github.com/evanw/esbuild/blob/master/CHANGELOG.md) and look for any breaking changes that they've introduced.
