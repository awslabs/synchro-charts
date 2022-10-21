# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

### Features

* add development quick start documentation ([ec4547e](https://github.com/awslabs/synchro-charts/pull/149/commits/ec4547eb5b931994f32c613945e52b4ef97f9945))





# 5.0.0 (2022-06-21)

### Breaking changes

* `liveModeOnlyMessage` property has been removed from components: ScKpi, ScStatusGrid, ScTable, ScTableBase, ScWidgetGrid, and moved to be a member of the `messageOverrides` property and renamed to `liveModeOnly`.




## 4.0.1 (2022-05-19)


### Bug Fixes

* correct datastream documentation ([#121](https://github.com/awslabs/synchro-charts/issues/121)) ([5850e3c](https://github.com/awslabs/synchro-charts/commit/5850e3c9d608298d54a24be1c2b823c419982319))
* live mode to always sync to current date ([#119](https://github.com/awslabs/synchro-charts/issues/119)) ([351a6e2](https://github.com/awslabs/synchro-charts/commit/351a6e25c6f20fb26c91132986ad52bfde27f595))
* prevent status-timeline from regenerating new viewport on every render ([#112](https://github.com/awslabs/synchro-charts/issues/112)) ([8b5481b](https://github.com/awslabs/synchro-charts/commit/8b5481b1f2eaa893ef6582b3278046b2cf7e467b))
* remove global html font-size and adjust styles and integration tests ([#123](https://github.com/awslabs/synchro-charts/issues/123)) ([2488f54](https://github.com/awslabs/synchro-charts/commit/2488f546e12985d34a961d09fa0567d9cbbc0657))
* typo in associatedStreams ([#142](https://github.com/awslabs/synchro-charts/issues/142)) ([988d05d](https://github.com/awslabs/synchro-charts/commit/988d05d6270c8816c649c8c62d0686aff020b23e))


### Features

* Add support for aggregated data in KPI and status grid ([#132](https://github.com/awslabs/synchro-charts/issues/132)) ([7534e77](https://github.com/awslabs/synchro-charts/commit/7534e77e13fc24e98dbb499c48e56e66945b67c8))





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

## 1.0.8 (2022-01-11)

**Note:** Version bump only for package @synchro-charts/doc-site





## 1.0.7 (2021-12-14)

**Note:** Version bump only for package @synchro-charts/doc-site
