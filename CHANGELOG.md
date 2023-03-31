# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.7.1](https://github.com/awslabs/synchro-charts/compare/root-v1.7.0...root-v1.7.1) (2023-03-31)


### Bug Fixes

* **legend:** fix name and unit gap in legend ([25fd79c](https://github.com/awslabs/synchro-charts/commit/25fd79c35c5e3cf3e296c81cdd6ca2e94fd5d950))

## [1.7.0](https://github.com/awslabs/synchro-charts/compare/root-v1.6.0...root-v1.7.0) (2023-03-29)


### Features

* **iot-app-kit-vis:** replace dateChanged event emitter with setViewport ([#264](https://github.com/awslabs/synchro-charts/issues/264)) ([804d0f9](https://github.com/awslabs/synchro-charts/commit/804d0f9cee5cbb6f53eeb1db68ea9a4b4f3a57b2))
* rename any sc- components to iot-app-kit-vis- ([#260](https://github.com/awslabs/synchro-charts/issues/260)) ([657efab](https://github.com/awslabs/synchro-charts/commit/657efab572009969bd6b450c4e84e99a47c45b92))
* rename core pckg to iot-app-kit/charts-core ([773775a](https://github.com/awslabs/synchro-charts/commit/773775a21a6ce5977b73ae2c32d4671c5055b126))
* replace SC components with iot-app-kit/charts in react package ([b3f3428](https://github.com/awslabs/synchro-charts/commit/b3f342869761a7036491273e6151b63d558eaf92))
* replace synchro-charts in react package with charts-core ([e8ca248](https://github.com/awslabs/synchro-charts/commit/e8ca2488440ca2b68285ce5a085d5758fa4d809a))
* **status-timeline:** visually differentiate value change when data points have no associated breached thresholds ([94f6181](https://github.com/awslabs/synchro-charts/commit/94f61816aa46a5ba406552891180a74d2e625dfd))
* **synchro-charts:** refactor webgl context to all it to be placed in any scope ([94f7f3b](https://github.com/awslabs/synchro-charts/commit/94f7f3b3675f04700c5cc123d3698bf81b2ebc2e))


### Bug Fixes

* **base-chart:** fix gesture+live mode bug and throttle ([da96931](https://github.com/awslabs/synchro-charts/commit/da969319fd474000c2096194265ed43cb3b60231))
* do not call dateRangeChange in live mode ([#220](https://github.com/awslabs/synchro-charts/issues/220)) ([a1934cc](https://github.com/awslabs/synchro-charts/commit/a1934cc2cc276aab93f32a60a5e1b2441b14e7ba))
* do not emit dateRangeChange in live mode ([#210](https://github.com/awslabs/synchro-charts/issues/210)) ([290098b](https://github.com/awslabs/synchro-charts/commit/290098bbe76ec030c55c44ddfd29b0cfb15bc5ea))
* missing scene issue [#255](https://github.com/awslabs/synchro-charts/issues/255) ([#233](https://github.com/awslabs/synchro-charts/issues/233)) ([c285e9e](https://github.com/awslabs/synchro-charts/commit/c285e9e2e26fcb78cad14d6a6d4469b348d221d2))
* stop onUpdate if scene does not exist ([#226](https://github.com/awslabs/synchro-charts/issues/226)) ([719ef32](https://github.com/awslabs/synchro-charts/commit/719ef32a6dc85b52e496e39ee32a229dfa2fb40f))
* **styles:** fix table row height ([#228](https://github.com/awslabs/synchro-charts/issues/228)) ([f4c2ca0](https://github.com/awslabs/synchro-charts/commit/f4c2ca0981b29b0889fc1a7a75e69d2a5f499049))

## [1.5.0](https://github.com/awslabs/synchro-charts/compare/root-v1.4.0...root-v1.5.0) (2023-03-27)


### Features

* **iot-app-kit-vis:** replace dateChanged event emitter with setViewport ([#264](https://github.com/awslabs/synchro-charts/issues/264)) ([804d0f9](https://github.com/awslabs/synchro-charts/commit/804d0f9cee5cbb6f53eeb1db68ea9a4b4f3a57b2))
* rename any sc- components to iot-app-kit-vis- ([#260](https://github.com/awslabs/synchro-charts/issues/260)) ([657efab](https://github.com/awslabs/synchro-charts/commit/657efab572009969bd6b450c4e84e99a47c45b92))
* rename core pckg to iot-app-kit/charts-core ([773775a](https://github.com/awslabs/synchro-charts/commit/773775a21a6ce5977b73ae2c32d4671c5055b126))
* replace SC components with iot-app-kit/charts in react package ([b3f3428](https://github.com/awslabs/synchro-charts/commit/b3f342869761a7036491273e6151b63d558eaf92))
* replace synchro-charts in react package with charts-core ([e8ca248](https://github.com/awslabs/synchro-charts/commit/e8ca2488440ca2b68285ce5a085d5758fa4d809a))
* **status-timeline:** visually differentiate value change when data points have no associated breached thresholds ([94f6181](https://github.com/awslabs/synchro-charts/commit/94f61816aa46a5ba406552891180a74d2e625dfd))
* **synchro-charts:** refactor webgl context to all it to be placed in any scope ([94f7f3b](https://github.com/awslabs/synchro-charts/commit/94f7f3b3675f04700c5cc123d3698bf81b2ebc2e))


### Bug Fixes

* do not call dateRangeChange in live mode ([#220](https://github.com/awslabs/synchro-charts/issues/220)) ([a1934cc](https://github.com/awslabs/synchro-charts/commit/a1934cc2cc276aab93f32a60a5e1b2441b14e7ba))
* do not emit dateRangeChange in live mode ([#210](https://github.com/awslabs/synchro-charts/issues/210)) ([290098b](https://github.com/awslabs/synchro-charts/commit/290098bbe76ec030c55c44ddfd29b0cfb15bc5ea))
* missing scene issue [#255](https://github.com/awslabs/synchro-charts/issues/255) ([#233](https://github.com/awslabs/synchro-charts/issues/233)) ([c285e9e](https://github.com/awslabs/synchro-charts/commit/c285e9e2e26fcb78cad14d6a6d4469b348d221d2))
* stop onUpdate if scene does not exist ([#226](https://github.com/awslabs/synchro-charts/issues/226)) ([719ef32](https://github.com/awslabs/synchro-charts/commit/719ef32a6dc85b52e496e39ee32a229dfa2fb40f))
* **styles:** fix table row height ([#228](https://github.com/awslabs/synchro-charts/issues/228)) ([f4c2ca0](https://github.com/awslabs/synchro-charts/commit/f4c2ca0981b29b0889fc1a7a75e69d2a5f499049))

## [1.3.0](https://github.com/awslabs/synchro-charts/compare/root-v1.2.0...root-v1.3.0) (2023-03-27)


### Features

* **iot-app-kit-vis:** replace dateChanged event emitter with setViewport ([#264](https://github.com/awslabs/synchro-charts/issues/264)) ([804d0f9](https://github.com/awslabs/synchro-charts/commit/804d0f9cee5cbb6f53eeb1db68ea9a4b4f3a57b2))

## [1.2.0](https://github.com/awslabs/synchro-charts/compare/root-v1.1.0...root-v1.2.0) (2023-03-09)


### Features

* rename any sc- components to iot-app-kit-vis- ([#260](https://github.com/awslabs/synchro-charts/issues/260)) ([657efab](https://github.com/awslabs/synchro-charts/commit/657efab572009969bd6b450c4e84e99a47c45b92))

## [1.1.0](https://github.com/awslabs/synchro-charts/compare/root-v1.0.0...root-v1.1.0) (2023-03-07)


### Features

* **status-timeline:** visually differentiate value change when data points have no associated breached thresholds ([94f6181](https://github.com/awslabs/synchro-charts/commit/94f61816aa46a5ba406552891180a74d2e625dfd))
* **synchro-charts:** refactor webgl context to all it to be placed in any scope ([94f7f3b](https://github.com/awslabs/synchro-charts/commit/94f7f3b3675f04700c5cc123d3698bf81b2ebc2e))


### Bug Fixes

* do not call dateRangeChange in live mode ([#220](https://github.com/awslabs/synchro-charts/issues/220)) ([a1934cc](https://github.com/awslabs/synchro-charts/commit/a1934cc2cc276aab93f32a60a5e1b2441b14e7ba))
* do not emit dateRangeChange in live mode ([#210](https://github.com/awslabs/synchro-charts/issues/210)) ([290098b](https://github.com/awslabs/synchro-charts/commit/290098bbe76ec030c55c44ddfd29b0cfb15bc5ea))
* missing scene issue [#255](https://github.com/awslabs/synchro-charts/issues/255) ([#233](https://github.com/awslabs/synchro-charts/issues/233)) ([c285e9e](https://github.com/awslabs/synchro-charts/commit/c285e9e2e26fcb78cad14d6a6d4469b348d221d2))
* stop onUpdate if scene does not exist ([#226](https://github.com/awslabs/synchro-charts/issues/226)) ([719ef32](https://github.com/awslabs/synchro-charts/commit/719ef32a6dc85b52e496e39ee32a229dfa2fb40f))
* **styles:** fix table row height ([#228](https://github.com/awslabs/synchro-charts/issues/228)) ([f4c2ca0](https://github.com/awslabs/synchro-charts/commit/f4c2ca0981b29b0889fc1a7a75e69d2a5f499049))

## 1.0.0 (2023-03-06)
* first iot-app-kit-visualizations release
