## [2.0.1](https://github.com/retejs/minimap-plugin/compare/v2.0.0...v2.0.1) (2023-09-30)


### Bug Fixes

* resolve exception triggered by asynchronous node removal ([5525712](https://github.com/retejs/minimap-plugin/commit/5525712098935603f700e67f25f3ff149dd50bf8))

## v2.0.0-beta.6

Breaking changes:

- removed generic from `MinimapExtra` (`MinimapExtra<Schemes>` -> `MinimapExtra`)
- removed generic from `MinimapPlugin` (`new MinimapPlugin<Schemes, AreaExtra>` ->  `new MinimapPlugin<Schemes>`)
