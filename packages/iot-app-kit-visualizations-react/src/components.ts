/* eslint-disable */
/* tslint:disable */
/* auto-generated react proxies */
import { createReactComponent } from './react-component-lib';

import { JSX } from '@synchro-charts/core';

import { defineCustomElements, applyPolyfills } from '@synchro-charts/core/dist/loader';

applyPolyfills().then(() => defineCustomElements());
export const LineChart = /*@__PURE__*/createReactComponent<JSX.ScLineChart, HTMLScLineChartElement>('iot-app-kit-vis-line-chart');
export const ScatterChart = /*@__PURE__*/createReactComponent<JSX.ScScatterChart, HTMLScScatterChartElement>('iot-app-kit-vis-scatter-chart');
export const BarChart = /*@__PURE__*/createReactComponent<JSX.ScBarChart, HTMLScBarChartElement>('iot-app-kit-vis-bar-chart');
export const StatusTimeline = /*@__PURE__*/createReactComponent<JSX.ScWebglContext, HTMLScWebglContextElement>('iot-app-kit-vis-status-timeline');
export const WebglContext = /*@__PURE__*/createReactComponent<JSX.ScWebglContext, HTMLScWebglContextElement>('iot-app-kit-vis-webgl-context');
