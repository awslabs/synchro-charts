# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.2.0](https://github.com/awslabs/synchro-charts/compare/root-v7.1.6...root-v7.2.0) (2023-02-03)


### Features

* **status-timeline:** visually differentiate value change when data points have no associated breached thresholds ([94f6181](https://github.com/awslabs/synchro-charts/commit/94f61816aa46a5ba406552891180a74d2e625dfd))
* **synchro-charts:** refactor webgl context to all it to be placed in any scope ([94f7f3b](https://github.com/awslabs/synchro-charts/commit/94f7f3b3675f04700c5cc123d3698bf81b2ebc2e))

## [7.1.6](https://github.com/awslabs/synchro-charts/compare/root-v7.1.5...root-v7.1.6) (2023-01-30)


### Bug Fixes

* missing scene issue [#255](https://github.com/awslabs/synchro-charts/issues/255) ([#233](https://github.com/awslabs/synchro-charts/issues/233)) ([c285e9e](https://github.com/awslabs/synchro-charts/commit/c285e9e2e26fcb78cad14d6a6d4469b348d221d2))

## [7.1.5](https://github.com/awslabs/synchro-charts/compare/root-v7.1.4...root-v7.1.5) (2023-01-18)


### Bug Fixes

* **styles:** fix table row height ([#228](https://github.com/awslabs/synchro-charts/issues/228)) ([f4c2ca0](https://github.com/awslabs/synchro-charts/commit/f4c2ca0981b29b0889fc1a7a75e69d2a5f499049))

## [7.1.4](https://github.com/awslabs/synchro-charts/compare/root-v7.1.3...root-v7.1.4) (2023-01-13)


### Bug Fixes

* stop onUpdate if scene does not exist ([#226](https://github.com/awslabs/synchro-charts/issues/226)) ([719ef32](https://github.com/awslabs/synchro-charts/commit/719ef32a6dc85b52e496e39ee32a229dfa2fb40f))

## [7.1.3](https://github.com/awslabs/synchro-charts/compare/root-v7.1.2...root-v7.1.3) (2022-12-29)


### Bug Fixes

* do not call dateRangeChange in live mode ([#220](https://github.com/awslabs/synchro-charts/issues/220)) ([a1934cc](https://github.com/awslabs/synchro-charts/commit/a1934cc2cc276aab93f32a60a5e1b2441b14e7ba))
* do not emit dateRangeChange in live mode ([#210](https://github.com/awslabs/synchro-charts/issues/210)) ([290098b](https://github.com/awslabs/synchro-charts/commit/290098bbe76ec030c55c44ddfd29b0cfb15bc5ea))

## 7.1.2 (2022-12-22)

### Chore

* chore: move check for unsupported data ([#216](https://github.com/awslabs/synchro-charts/pull/216)) ([d4e7702](https://github.com/awslabs/synchro-charts/commit/d4e7702a0d8ee329f0f15d0b6100c292ea81e44a))


## [7.1.1](https://github.com/awslabs/synchro-charts/compare/root-v7.1.0...root-v7.1.1) (2022-12-20)


### Bug Fixes

* do not emit dateRangeChange in live mode ([#210](https://github.com/awslabs/synchro-charts/issues/210)) ([290098b](https://github.com/awslabs/synchro-charts/commit/290098bbe76ec030c55c44ddfd29b0cfb15bc5ea))

## 7.1.0 (2022-12-12)

### Features

feat: add 'contains' operator to thresholds ([#190](https://github.com/awslabs/synchro-charts/pull/190)) ([93931bd](https://github.com/awslabs/synchro-charts/commit/93931bd897f6f8ba7aadaba51d4e26b47b0d5c3e))

### Bug Fixes

* fix: prevent update if unsupported data is present ([#196](https://github.com/awslabs/synchro-charts/pull/196)) ([7f4e698](https://github.com/awslabs/synchro-charts/commit/7f4e6988163a14ba1e9d41180c909df896b18497))


## 7.0.0 (2022-11-23)

### Breaking changes

* feat: errors for unsupported data types ([#186](https://github.com/awslabs/synchro-charts/pull/186)) ([003b9ae](https://github.com/awslabs/synchro-charts/commit/003b9ae286fc755561eb0fb86bfa046ed039cfe5))
* fix: apply default breached thresholds behavior to all thresholds ([#183](https://github.com/awslabs/synchro-charts/pull/183) ([89a24cb](https://github.com/awslabs/synchro-charts/commit/89a24cbbca1ca6ccdcf3a46d1519c5487519739a))

### Bug Fixes

* fix: fix severity for breached thresholds ([#183](https://github.com/awslabs/synchro-charts/pull/183)) ([89a24cb](https://github.com/awslabs/synchro-charts/commit/89a24cbbca1ca6ccdcf3a46d1519c5487519739a))
* feat: add comparators in threshold labels ([#183](https://github.com/awslabs/synchro-charts/pull/183)) ([89a24cb](https://github.com/awslabs/synchro-charts/commit/89a24cbbca1ca6ccdcf3a46d1519c5487519739a))

## 6.1.0 (2022-11-18)

### Features
* feat: add boolean data type to primitives ([#182](https://github.com/awslabs/synchro-charts/pull/182)) ([0728fdc](https://github.com/awslabs/synchro-charts/commit/0728fdc324a42a66f0e5df3ac9d9c2756d55d397))

## 6.0.5 (2022-11-03)

### Bug Fixes
* fix: y-axis no longer cuts off digits, instead uses SI format with 2 significant digits ([#175](https://github.com/awslabs/synchro-charts/pull/175)) ([d03068d](https://github.com/awslabs/synchro-charts/pull/175/commits/d03068d2128e2b1400e60a8b59c6210ef2849a5d))

## 6.0.4 (2022-10-21)

### Bug Fixes

* fix: switch to fork of d3-color 1.4.x with backtracking fix from 3.1.0 applied ([#171](https://github.com/awslabs/synchro-charts/pull/171)) ([ec57a98](https://github.com/awslabs/synchro-charts/pull/171/commits/ec57a981581517a847eb59a1367a7e71037c75f3))

## 6.0.3 (2022-10-21)

### Bug Fixes

* Revert "chore: bump d3-color to 3.1.0, add postinstall hook to fix export path (#167)" ([#170](https://github.com/awslabs/synchro-charts/pull/170)) ([1a47303](https://github.com/awslabs/synchro-charts/pull/170/commits/ae8220da42758a6ff9796e36e15b0032ec13774f))

## 6.0.2 (2022-10-19)

### Bug Fixes

* chore: bump d3-color to 3.1.0, add postinstall hook to fix export path ([#167](https://github.com/awslabs/synchro-charts/pull/167)) ([1a47303](https://github.com/awslabs/synchro-charts/pull/167/commits/1a473031c55dd4a1f28e66bb423f734865bafc25))

## 6.0.1 (2022-08-24)

### Bug Fixes

* fix: Prevent tooltip from leaving components area when cursor is on the right side of the widget ([#158](https://github.com/awslabs/synchro-charts/issues/157)) ([6eebeee](https://github.com/awslabs/synchro-charts/pull/158/commits/61b491c1ae0e7906adcd37ffb86ed976383491f0))

## 6.0.0 (2022-08-09)

### Bug Fixes

* fix dateRangeChange incorrectly being called when new data comes in during live mode ([#150](https://github.com/awslabs/synchro-charts/issues/150)) ([797b043](https://github.com/awslabs/synchro-charts/pull/155/commits/797b04317b7a2f67d03823e18e072d5bb04cf2ef))

### Features

* add development quick start documentation ([ec4547e](https://github.com/awslabs/synchro-charts/pull/149/commits/ec4547eb5b931994f32c613945e52b4ef97f9945))






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
