/* eslint-disable */
/* tslint:disable */
/* auto-generated react proxies */
import { createReactComponent } from './react-component-lib';

import { JSX } from '@synchro-charts/core';

import { defineCustomElements, applyPolyfills } from '@synchro-charts/core/dist/loader';

applyPolyfills().then(() => defineCustomElements());
export const LineChart = /*@__PURE__*/createReactComponent<JSX.MonitorLineChart, HTMLMonitorLineChartElement>('monitor-line-chart');
export const ScatterChart = /*@__PURE__*/createReactComponent<JSX.MonitorScatterChart, HTMLMonitorScatterChartElement>('monitor-scatter-chart');
export const BarChart = /*@__PURE__*/createReactComponent<JSX.ScBarChart, HTMLScBarChartElement>('sc-bar-chart');
export const KPI = /*@__PURE__*/createReactComponent<JSX.MonitorWebglContext, HTMLMonitorWebglContextElement>('monitor-kpi');
export const StatusGrid = /*@__PURE__*/createReactComponent<JSX.MonitorWebglContext, HTMLMonitorWebglContextElement>('monitor-status-grid');
export const StatusTimeline = /*@__PURE__*/createReactComponent<JSX.MonitorWebglContext, HTMLMonitorWebglContextElement>('monitor-status-chart');
export const Table = /*@__PURE__*/createReactComponent<JSX.MonitorWebglContext, HTMLMonitorWebglContextElement>('monitor-table');
export const WebglContext = /*@__PURE__*/createReactComponent<JSX.MonitorWebglContext, HTMLMonitorWebglContextElement>('monitor-webgl-context');
