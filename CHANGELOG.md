## [2.0.3](https://github.com/retejs/minimap-plugin/compare/v2.0.2...v2.0.3) (2024-08-30)


### Bug Fixes

* update cli and fix linting errors ([6aa359f](https://github.com/retejs/minimap-plugin/commit/6aa359febe4f1ccbb7f1bdb2d6d0613e757a192a))

## [2.0.2](https://github.com/retejs/minimap-plugin/compare/v2.0.1...v2.0.2) (2024-01-27)


### Bug Fixes

* **build:** source maps ([b95648f](https://github.com/retejs/minimap-plugin/commit/b95648f012437446d238dfd0e93ac3a54cd985c9))

## [2.0.1](https://github.com/retejs/minimap-plugin/compare/v2.0.0...v2.0.1) (2023-09-30)


### Bug Fixes

* resolve exception triggered by asynchronous node removal ([5525712](https://github.com/retejs/minimap-plugin/commit/5525712098935603f700e67f25f3ff149dd50bf8))

## v2.0.0-beta.6

Breaking changes:

- removed generic from `MinimapExtra` (`MinimapExtra<Schemes>` -> `MinimapExtra`)
- removed generic from `MinimapPlugin` (`new MinimapPlugin<Schemes, AreaExtra>` ->  `new MinimapPlugin<Schemes>`)
