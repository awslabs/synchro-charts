# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2022-02-27)


### Breaking changes

* remove preventPropagation flag ([04b3d1f](https://github.com/awslabs/synchro-charts/commit/04b3d1f2b9798fb52ebc5644dfbf47cf0f5a0afa)) This will alter the behavior of how `dateRangeChange` events are emitted, so that each widget will emit a `dateRangeEvent` within a group, rather than just the widget which has the gesture acted upon.





## 2.0.0 (2022-2-21)

### Bug Fixes

* Major css fix, this release removes font-size for the HTML element as it fixes the base unit for the styles which may requires consumers to override this rule.

## 1.1.0 (2022-2-13)

### Bug Fixes

* Ensure that while utilizing live mode, when the browser isn't in focus, upon return to the browser focus that live mode will ensure that you are still viewing the current time frame.

## 1.0.8 (2022-01-11)


### Bug Fixes

* prevent status-timeline from regenerating new viewport on every render ([de1a90e](https://github.com/awslabs/synchro-charts/commit/de1a90e21b44e4baefef167d0321841e8304d9ba))





## 1.0.7 (2021-12-14)


### Bug Fixes

* stop ticker when updating viewport duration ([#108](https://github.com/awslabs/synchro-charts/issues/108)) ([c1c1793](https://github.com/awslabs/synchro-charts/commit/c1c1793fab8918f9e4bfd98313728e42eb5302c9))
