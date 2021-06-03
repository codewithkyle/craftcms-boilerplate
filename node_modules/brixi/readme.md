# Brixi

A lightweight (1.3kb) highly configurable utility-first CSS framework.

## Installation

Install the npm package

```sh
npm i -S brixi
```

Add the startup script to your `package.json` file

```json
"brixi": "brixi"
```

Run the script

```sh
npm run brixi
```

Or use the CDN version:

```html
<link href="https://unpkg.com/brixi@^0.3/brixi.min.css" rel="stylesheet">
```

## Configuration

Below is the default config file. Any value can be overridden by adding a `brixi.config.js` file to your project's root directory.

```javascript
module.exports = {
    outDir: "./brixi",
    important: true, // when true the !important specificity selector is applied
    output: "production", // can be 'production' or 'source'
    features: { // disable unwanted features to create smaller CSS files
        aspectRatios: true,
        borders: true,
        containers: true,
        cursors: true,
        flexbox: true,
        fonts: true,
        grid: true,
        lineHeight: true,
        margin: true,
        padding: true,
        scroll: true,
        shadows: true,
        positions: true,
        backgrounds: true,
        alignment: true,
        whitespace: true,
        textTransforms: true,
        display: true,
    },
    fonts: {
        families: {
            base: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
            mono: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        },
        weights: {
            hairline: 100,
            thin: 200,
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            heavy: 800,
            black: 900,
        },
        sizes: {
            xs: 0.75,
            sm: 0.875,
            base: 1,
            md: 1.125,
            lg: 1.25,
            xl: 1.5,
            "2xl": 1.875,
            "3xl": 2.25,
        },
    },
    colors: {
        white: "#ffffff",
        black: "#000000",
        primary: {
            100: "#EBF8FF",
            200: "#BEE3F8",
            300: "#90CDF4",
            400: "#63B3ED",
            500: "#4299E1",
            600: "#3182CE",
            700: "#2B6CB0",
            800: "#2C5282",
            900: "#2A4365",
        },
        danger: {
            100: "#FFF5F5",
            200: "#FED7D7",
            300: "#FEB2B2",
            400: "#FC8181",
            500: "#F56565",
            600: "#E53E3E",
            700: "#C53030",
            800: "#9B2C2C",
            900: "#742A2A",
        },
        warning: {
            100: "#FFFFF0",
            200: "#FEFCBF",
            300: "#FAF089",
            400: "#F6E05E",
            500: "#ECC94B",
            600: "#D69E2E",
            700: "#B7791F",
            800: "#975A16",
            900: "#744210",
        },
        success: {
            100: "#F0FFF4",
            200: "#C6F6D5",
            300: "#9AE6B4",
            400: "#68D391",
            500: "#48BB78",
            600: "#38A169",
            700: "#2F855A",
            800: "#276749",
            900: "#22543D",
        },
        grey: {
            100: "#F7FAFC",
            200: "#EDF2F7",
            300: "#E2E8F0",
            400: "#CBD5E0",
            500: "#A0AEC0",
            600: "#718096",
            700: "#4A5568",
            800: "#2D3748",
            900: "#1A202C",
        },
        neutral: {
            100: "#f5f5f5",
            200: "#eeeeee",
            300: "#e0e0e0",
            400: "#bdbdbd",
            500: "#9e9e9e",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
        },
    },
    margins: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 6],
    padding: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 6],
    positions: [0],
    borders: {
        styles: ["solid", "dashed", "dotted"],
        widths: [0, 1, 2],
        radius: [0.125, 0.25, 0.5],
    },
    shadows: {
        xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        lg: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        xl: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "2xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "3xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    containers: {
        screens: {
            mobile: 411,
            tablet: 768,
            laptop: 1024,
            desktop: 1280,
            hd: 1920,
            "4k": 3840,
        },
        columns: [2, 3, 4],
    },
    gaps: [1, 1.5, 2],
    easings: {
        "in-out": "0.4, 0.0, 0.2, 1",
        in: "0.0, 0.0, 0.2, 1",
        out: "0.4, 0.0, 1, 1",
        bounce: "0.175, 0.885, 0.32, 1.275",
    },
    aspectRatios: ["16:9", "4:3", "1:1"]
};
```
