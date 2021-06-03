# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2020-09-10

### Added

-   `autoresolve` resolution functionality for scss files

## [0.3.0] - 2020-09-10

### Added

-   preflight resets `<button>` padding
-   preflight resets `<a>` text color and decoration styles
-   CSSMonster will throw an error when two files have the same name
-   `autoresolve` config value -- boolean

### Updated

-   npm packages

## [0.2.1] - 2020-06-05

### Updated

-   npm packages

## [0.2.0] - 2020-02-10

### Added

-   updated purgeCSS to v2 [#3](https://github.com/codewithkyle/cssmonster/issues/3)
-   ability to include node-sass paths [#4](https://github.com/codewithkyle/cssmonster/issues/4)

## [0.1.1] - 2020-01-18

### Fixed

-   No longer using `compressed` output because it was stripping comments needed to temporarily disable purgeCSS
-   CSSMonster wasn't using the `minify` boolean provided in the config file

## [0.1.0] - 2020-01-11

### Added

-   Initial CLI command
-   Initial script
-   Merges and generates `normalize.css`
-   Developers can disable `purgeCSS`
-   CLI consumes user provided config file

[unreleased]: https://github.com/codewithkyle/cssmonster/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/codewithkyle/cssmonster/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/codewithkyle/cssmonster/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/codewithkyle/cssmonster/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/codewithkyle/cssmonster/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/codewithkyle/cssmonster/releases/tag/v0.1.0
