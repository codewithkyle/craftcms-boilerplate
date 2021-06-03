# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2021-05-01

### Fixed

- subscriptions are no longer deleted when the last inbox is unsubscribed ([#1](https://github.com/codewithkyle/pubsub/issues/1))
- create subscriptions when an inbox is registered to an invalid (missing) subscription

## [1.1.0] - 2021-03-03

### Added

- readme CDN version number auto-bump script
- changed the NPM versions output target from `ES2019` to `ESNext`
- new `publish()` method -- will replace `post()`

### Deprecated

- `post()` method -- use `publish()` instead

## [1.0.0] - 2021-03-03

### Added

- initial Event Bus functionality
    - create subscriptions
    - destroy subscriptions
    - post messages
    - register inboxes
    - unregister inboxes
- changelog
- basic readme documentation

[Unreleased]: https://github.com/codewithkyle/pubsub/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/codewithkyle/pubsub/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/codewithkyle/pubsub/releases/tag/v1.0.0