# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.0.0 (2022-06-21)

### Breaking changes

* `liveModeOnlyMessage` property has been removed from components: ScKpi, ScStatusGrid, ScTable, ScTableBase, ScWidgetGrid, and moved to be a member of the `messageOverrides` property and renamed to `liveModeOnly`.





## 4.0.1 (2022-05-19)


### Bug Fixes

* applied stylelint changes; enforced no uncommit changes in npm test script ([#130](https://github.com/awslabs/synchro-charts/issues/130)) ([0efa3f7](https://github.com/awslabs/synchro-charts/commit/0efa3f73ff05b4683078e56b75ba818975f594c3))
* correct datastream documentation ([#121](https://github.com/awslabs/synchro-charts/issues/121)) ([5850e3c](https://github.com/awslabs/synchro-charts/commit/5850e3c9d608298d54a24be1c2b823c419982319))
* include updated types ([#122](https://github.com/awslabs/synchro-charts/issues/122)) ([fa7449a](https://github.com/awslabs/synchro-charts/commit/fa7449a6780c8c6d1e595683dd97ab336a017929))
* live mode to always sync to current date ([#119](https://github.com/awslabs/synchro-charts/issues/119)) ([351a6e2](https://github.com/awslabs/synchro-charts/commit/351a6e25c6f20fb26c91132986ad52bfde27f595))
* prevent status-timeline from regenerating new viewport on every render ([#112](https://github.com/awslabs/synchro-charts/issues/112)) ([8b5481b](https://github.com/awslabs/synchro-charts/commit/8b5481b1f2eaa893ef6582b3278046b2cf7e467b))
* Provide chart size when chart scene is re-registered ([c4db912](https://github.com/awslabs/synchro-charts/commit/c4db9129e37c749892aa90eef3d342115c35bb57))
* remove global html font-size and adjust styles and integration tests ([#123](https://github.com/awslabs/synchro-charts/issues/123)) ([2488f54](https://github.com/awslabs/synchro-charts/commit/2488f546e12985d34a961d09fa0567d9cbbc0657))
* stop ticker when updating viewport duration ([#108](https://github.com/awslabs/synchro-charts/issues/108)) ([c1c1793](https://github.com/awslabs/synchro-charts/commit/c1c1793fab8918f9e4bfd98313728e42eb5302c9))
* typo in associatedStreams ([#142](https://github.com/awslabs/synchro-charts/issues/142)) ([988d05d](https://github.com/awslabs/synchro-charts/commit/988d05d6270c8816c649c8c62d0686aff020b23e))


### Features

* Add support for aggregated data in KPI and status grid ([#132](https://github.com/awslabs/synchro-charts/issues/132)) ([7534e77](https://github.com/awslabs/synchro-charts/commit/7534e77e13fc24e98dbb499c48e56e66945b67c8))
* Deploy docs only on push to main ([#125](https://github.com/awslabs/synchro-charts/issues/125)) ([7d378c6](https://github.com/awslabs/synchro-charts/commit/7d378c6b28fac7fb36e9dd1689e5f11900742c0a))






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
