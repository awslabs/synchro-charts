/**
 * All test routes should follow the path structure of
 *
 * /test/{COMPONENT_NAME}/{TEST_ROUTE_COMPONENT_NAME}
 */

export const routes = [
  {
    url: '/',
    component: 'testing-ground',
  },
  {
    url: '/demo',
    component: 'synchro-demo',
  },
  {
    url: '/tests/kpi',
    component: 'sc-kpi-standard',
  },
  {
    url: '/tests/status-grid',
    component: 'sc-status-grid-standard',
  },
  {
    url: '/tests/sc-webgl-chart/circle-point-shaders',
    component: 'sc-circle-point-shaders',
  },
  {
    url: '/tests/sc-webgl-chart/angled-line-segment',
    component: 'sc-angled-line-segment',
  },
  {
    url: '/tests/sc-webgl-chart/single-bar',
    component: 'sc-single-bar',
  },
  {
    url: '/tests/sc-webgl-chart/multiple-bars',
    component: 'sc-multiple-bars',
  },
  {
    url: '/tests/sc-webgl-chart/single-colored-bar',
    component: 'sc-single-colored-bar',
  },
  {
    url: '/tests/sc-webgl-chart/straight-line-segment-colored',
    component: 'sc-straight-line-segment-colored',
  },
  {
    url: '/tests/sc-webgl-chart/straight-line-segment',
    component: 'sc-straight-line-segment',
  },
  {
    url: '/tests/sc-webgl-chart/line-chart-dynamic-data-streams',
    component: 'sc-webgl-line-chart-dynamic-data-streams',
  },
  {
    url: '/tests/sc-webgl-chart/line-chart-dynamic-buffer',
    component: 'sc-webgl-line-chart-dynamic-buffer',
  },
  {
    url: '/tests/sc-webgl-chart/line-chart-dynamic-data',
    component: 'sc-webgl-line-chart-dynamic-data',
  },
  {
    url: '/tests/sc-webgl-chart/standard-with-legend',
    component: 'sc-webgl-chart-standard-with-legend',
  },
  {
    url: '/tests/sc-webgl-chart/standard-with-legend-on-right',
    component: 'sc-webgl-chart-standard-with-legend-on-right',
  },
  {
    url: '/tests/sc-webgl-chart/standard',
    component: 'sc-webgl-chart-standard',
  },
  {
    url: '/tests/sc-webgl-chart/sc-webgl-chart-large-viewport',
    component: 'sc-webgl-chart-large-viewport',
  },
  {
    url: '/tests/sc-webgl-chart/multi',
    component: 'sc-webgl-chart-multi',
  },
  {
    url: '/tests/sc-scatter-chart/scatter-chart-dynamic-data',
    component: 'sc-scatter-chart-dynamic-data',
  },
  {
    url: '/tests/sc-scatter-chart/trend-line-with-legend',
    component: 'sc-scatter-chart-trend-line-with-legend',
  },
  {
    url: '/tests/sc-scatter-chart/trend-line-color-configuration',
    component: 'sc-scatter-chart-trend-line-color-configuration',
  },
  {
    url: '/tests/sc-webgl-chart/colored-point',
    component: 'sc-line-chart-colored-point',
  },
  {
    url: '/tests/sc-webgl-chart/multiple-lines',
    component: 'sc-multiple-lines',
  },
  {
    url: '/tests/sc-webgl-chart/multiple-lines-overlapping',
    component: 'sc-multiple-lines-overlapping',
  },
  {
    url: '/tests/sc-expandable-input/standard',
    component: 'sc-expandable-input-standard',
  },
  {
    url: '/tests/sc-sizer-provider/sc-size-provider-standard',
    component: 'sc-size-provider-standard',
  },
  {
    url: '/tests/sc-webgl-bar-chart/standard',
    component: 'sc-webgl-bar-chart-standard',
  },
  {
    url: '/tests/sc-webgl-chart/sc-webgl-chart-dynamic-charts',
    component: 'sc-webgl-chart-dynamic-charts',
  },
  {
    url: '/tests/sc-webgl-bar-chart/bar-chart-dynamic-data-streams',
    component: 'sc-webgl-bar-chart-dynamic-data-streams',
  },
  {
    url: '/tests/sc-webgl-bar-chart/bar-chart-dynamic-data',
    component: 'sc-webgl-bar-chart-dynamic-data',
  },
  {
    url: '/tests/sc-webgl-bar-chart/bar-chart-fast-viewport',
    component: 'sc-webgl-bar-chart-fast-viewport',
  },
  {
    url: '/tests/sc-webgl-bar-chart/bar-chart-dynamic-buffer',
    component: 'sc-webgl-bar-chart-dynamic-buffer',
  },
  {
    url: '/tests/sc-webgl-bar-chart/negative',
    component: 'sc-webgl-bar-chart-negative',
  },
  {
    url: '/tests/sc-webgl-bar-chart/pos-neg',
    component: 'sc-webgl-bar-chart-positive-negative',
  },
  {
    url: '/tests/sc-webgl-bar-chart/threshold/coloration',
    component: 'sc-webgl-bar-chart-threshold-coloration',
  },
  {
    url: '/tests/sc-webgl-bar-chart/threshold/coloration-exact-point',
    component: 'sc-webgl-bar-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/sc-webgl-bar-chart/threshold/coloration-multiple-data-stream',
    component: 'sc-webgl-bar-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/sc-webgl-bar-chart/threshold/coloration-multiple-thresholds',
    component: 'sc-webgl-bar-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/sc-webgl-bar-chart/threshold/no-coloration',
    component: 'sc-webgl-bar-chart-threshold-no-coloration',
  },
  {
    url: '/tests/sc-webgl-bar-chart/threshold/coloration-band',
    component: 'sc-webgl-bar-chart-threshold-coloration-band',
  },
  {
    url: '/tests/sc-webgl-chart/performance/sc-line-chart-stream-data',
    component: 'sc-line-chart-stream-data',
  },
  {
    url: '/tests/sc-lazily-load/sc-lazily-load-standard',
    component: 'sc-lazily-load-standard',
  },
  {
    url: '/tests/sc-lazily-load/sc-lazily-load-web-component',
    component: 'sc-lazily-load-web-component',
  },
  {
    url: '/tests/sc-webgl-bar-chart/margin',
    component: 'sc-webgl-bar-chart-margin',
  },
  {
    url: '/tests/sc-webgl-chart/annotations/annotation-editable',
    component: 'sc-webgl-chart-annotation-editable',
  },
  {
    url: '/tests/sc-webgl-chart/annotations/draggable-multi',
    component: 'sc-annotations-draggable-multi',
  },
  {
    url: '/tests/sc-webgl-bar-chart/start-from-zero',
    component: 'sc-webgl-bar-chart-start-from-zero',
  },
  {
    url: '/tests/sc-webgl-chart/annotations',
    component: 'sc-webgl-chart-annotations',
  },
  {
    url: '/tests/sc-webgl-chart/threshold/coloration-split-half',
    component: 'sc-webgl-chart-threshold-coloration-split-half',
  },
  {
    url: '/tests/sc-webgl-chart/threshold/coloration-exact-point',
    component: 'sc-webgl-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/sc-webgl-chart/threshold/coloration-multiple-data-stream',
    component: 'sc-webgl-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/sc-webgl-chart/threshold/coloration-multiple-thresholds',
    component: 'sc-webgl-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/sc-webgl-chart/threshold/coloration-band',
    component: 'sc-webgl-chart-threshold-coloration-band',
  },
  {
    url: '/tests/sc-webgl-chart/annotations/always-in-viewport',
    component: 'sc-webgl-chart-annotations-always-in-viewport',
  },
  {
    url: '/tests/sc-webgl-chart/tooltip/multiple-data-streams',
    component: 'sc-webgl-chart-tooltip-with-multiple-data-streams',
  },
  {
    url: '/tests/sc-scatter-chart/tooltip/multiple-data-streams-and-trends',
    component: 'sc-scatter-chart-tooltip-with-multiple-data-streams-and-trends',
  },
  {
    url: '/tests/sc-scatter-chart/threshold/coloration',
    component: 'sc-scatter-chart-threshold',
  },
  {
    url: '/tests/sc-scatter-chart/threshold/coloration-exact-point',
    component: 'sc-scatter-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/sc-scatter-chart/threshold/coloration-multiple-data-stream',
    component: 'sc-scatter-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/sc-scatter-chart/threshold/coloration-multiple-thresholds',
    component: 'sc-scatter-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/sc-scatter-chart/threshold/coloration-band',
    component: 'sc-scatter-chart-threshold-coloration-band',
  },
  {
    url: '/tests/sc-webgl-chart/axis',
    component: 'sc-webgl-chart-axis',
  },
  {
    url: '/tests/chart/y-range',
    component: 'sc-chart-y-range',
  },
  {
    url: '/tests/sc-webgl-chart/annotations/no-annotations',
    component: 'sc-webgl-chart-no-annotations',
  },
  {
    url: '/tests/sc-scatter-chart/threshold/no-coloration',
    component: 'sc-scatter-chart-threshold-no-coloration',
  },
  {
    url: '/tests/common-components/sc-toggle',
    component: 'sc-toggle-test',
  },
  {
    url: '/tests/sc-webgl-chart/single-status',
    component: 'single-status',
  },
  {
    url: '/tests/sc-webgl-chart/single-colored-status',
    component: 'single-colored-status',
  },
  {
    url: '/tests/sc-webgl-chart/multiple-statuses',
    component: 'multiple-statuses',
  },
  {
    url: '/tests/status-timeline/standard',
    component: 'status-timeline-standard',
  },
  {
    url: '/tests/status-timeline/margin',
    component: 'status-timeline-margin',
  },
  {
    url: '/tests/status-timeline/status-timeline-dynamic-data-streams',
    component: 'status-timeline-dynamic-data-streams',
  },
  {
    url: '/tests/status-timeline/status-timeline-dynamic-data',
    component: 'status-timeline-dynamic-data',
  },
  {
    url: '/tests/status-timeline/status-timeline-dynamic-buffer',
    component: 'status-timeline-dynamic-buffer',
  },
  {
    url: '/tests/status-timeline/status-timeline-fast-viewport',
    component: 'status-timeline-fast-viewport',
  },
  {
    url: '/tests/status-timeline/threshold/coloration',
    component: 'status-timeline-threshold-coloration',
  },
  {
    url: '/tests/status-timeline/threshold/coloration-exact-point',
    component: 'status-timeline-threshold-coloration-exact-point',
  },
  {
    url: '/tests/status-timeline/threshold/coloration-multiple-data-stream',
    component: 'status-timeline-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/status-timeline/threshold/coloration-multiple-thresholds',
    component: 'status-timeline-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/status-timeline/threshold/coloration-band',
    component: 'status-timeline-threshold-coloration-band',
  },
  {
    url: '/tests/status-timeline/threshold/no-coloration',
    component: 'status-timeline-threshold-no-coloration',
  },
  {
    url: '/tests/status-timeline/multiple-data-streams',
    component: 'status-timeline-multiple-data-streams',
  },
  {
    url: '/tests/status-timeline/raw-data',
    component: 'status-timeline-raw-data',
  },
  {
    url: '/tests/line-chart/viewport-change',
    component: 'line-chart-viewport-change',
  },
  {
    url: '/tests/widget-test-route',
    component: 'widget-test-route',
  },
];
