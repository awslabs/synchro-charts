# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.


# 4.0.0 (2022-03-25)

### Bug Fixes

### Breaking changes
* emit dateRangeChange event on synchronized viewport changes ([9806222](https://github.com/awslabs/synchro-charts/commit/9806222400dc8811fa690dd697ba8b85939fcc35))
* deprecate `onRequestData` property ([9806222](https://github.com/awslabs/synchro-charts/commit/9806222400dc8811fa690dd697ba8b85939fcc35))

### Features

* support aggregations in table ([8e104bb](https://github.com/awslabs/synchro-charts/commit/8e104bb7f4e8b0ede3087af6b960a222d10ed419))



# 3.1.0 (2022-03-15)

### Features

* Add support for aggregated data in KPI and status grid ([e0dac46](https://github.com/awslabs/synchro-charts/commit/e0dac468c7d9c297eb520f14b2b2f71362bcbc0c))




# 3.0.0 (2022-02-27)


### Breaking changes

* remove preventPropagation flag ([04b3d1f](https://github.com/awslabs/synchro-charts/commit/04b3d1f2b9798fb52ebc5644dfbf47cf0f5a0afa)) This will alter the behavior of how `dateRangeChange` events are emitted, so that each widget will emit a `dateRangeEvent` within a group, rather than just the widget which has the gesture acted upon.





## 1.0.8 (2022-01-11)


### Bug Fixes

* prevent status-timeline from regenerating new viewport on every render ([de1a90e](https://github.com/awslabs/synchro-charts/commit/de1a90e21b44e4baefef167d0321841e8304d9ba))





## 1.0.7 (2021-12-14)


### Bug Fixes

* stop ticker when updating viewport duration ([#108](https://github.com/awslabs/synchro-charts/issues/108)) ([c1c1793](https://github.com/awslabs/synchro-charts/commit/c1c1793fab8918f9e4bfd98313728e42eb5302c9))
