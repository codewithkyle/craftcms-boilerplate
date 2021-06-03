# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2021-05-29

### Added

- support for the `--skip-build` flag ([#4](https://github.com/codewithkyle/twist/issues/4))

### Updated

- esbuild to [v0.12.5](https://github.com/evanw/esbuild/releases/tag/v0.12.5)

### Fixed

- single quote static import statements where not being scrubbed correctly
- now scrubbing mjs, cjs, jsx, and tsx file extensions from static import paths

## [1.2.0] - 2021-05-26

### Updated

- esbuild to [v0.12.3](https://github.com/evanw/esbuild/releases/tag/v0.12.3)

## [1.1.0] - 2021-05-07

### Added

- support for the following file formats:
    - `.jsx`
    - `.tsx`
    - `.mjs`
    - `.cjs`

## [1.0.1] - 2021-04-09

### Fixed

- import path scrubbing bug

## [1.0.0] - 2021-03-27

### Added

- basic static import scrubbing
- esbuild config override flag
- source directory override flag
- output directory override flag

[unreleased]: https://github.com/codewithkyle/twist/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/codewithkyle/twist/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codewithkyle/twist/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codewithkyle/twist/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/codewithkyle/twist/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/codewithkyle/twist/releases/tag/v1.0.0
