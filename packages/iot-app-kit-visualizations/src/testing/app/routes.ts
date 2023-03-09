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
    url: '/tests/webgl-context/nested',
    component: 'iot-app-kit-vis-webgl-context-nested',
  },
  {
    url: '/tests/webgl-context/root',
    component: 'iot-app-kit-vis-webgl-context-root',
  },
  {
    url: '/tests/webgl-chart/circle-point-shaders',
    component: 'iot-app-kit-vis-circle-point-shaders',
  },
  {
    url: '/tests/webgl-chart/angled-line-segment',
    component: 'iot-app-kit-vis-angled-line-segment',
  },
  {
    url: '/tests/webgl-chart/single-bar',
    component: 'iot-app-kit-vis-single-bar',
  },
  {
    url: '/tests/webgl-chart/multiple-bars',
    component: 'iot-app-kit-vis-multiple-bars',
  },
  {
    url: '/tests/webgl-chart/single-colored-bar',
    component: 'iot-app-kit-vis-single-colored-bar',
  },
  {
    url: '/tests/webgl-chart/straight-line-segment-colored',
    component: 'iot-app-kit-vis-straight-line-segment-colored',
  },
  {
    url: '/tests/webgl-chart/straight-line-segment',
    component: 'iot-app-kit-vis-straight-line-segment',
  },
  {
    url: '/tests/webgl-chart/line-chart-dynamic-data-streams',
    component: 'iot-app-kit-vis-webgl-line-chart-dynamic-data-streams',
  },
  {
    url: '/tests/webgl-chart/line-chart-dynamic-buffer',
    component: 'iot-app-kit-vis-webgl-line-chart-dynamic-buffer',
  },
  {
    url: '/tests/webgl-chart/line-chart-dynamic-data',
    component: 'iot-app-kit-vis-webgl-line-chart-dynamic-data',
  },
  {
    url: '/tests/webgl-chart/standard-with-legend',
    component: 'iot-app-kit-vis-webgl-chart-standard-with-legend',
  },
  {
    url: '/tests/webgl-chart/standard-with-legend-on-right',
    component: 'iot-app-kit-vis-webgl-chart-standard-with-legend-on-right',
  },
  {
    url: '/tests/webgl-chart/standard',
    component: 'iot-app-kit-vis-webgl-chart-standard',
  },
  {
    url: '/tests/webgl-chart/unsupported-data-types',
    component: 'line-chart-unsupported-data-types',
  },
  {
    url: '/tests/webgl-chart/webgl-chart-large-viewport',
    component: 'iot-app-kit-vis-webgl-chart-large-viewport',
  },
  {
    url: '/tests/webgl-chart/multi',
    component: 'iot-app-kit-vis-webgl-chart-multi',
  },
  {
    url: '/tests/scatter-chart/scatter-chart-dynamic-data',
    component: 'iot-app-kit-vis-scatter-chart-dynamic-data',
  },
  {
    url: '/tests/scatter-chart/trend-line-with-legend',
    component: 'iot-app-kit-vis-scatter-chart-trend-line-with-legend',
  },
  {
    url: '/tests/scatter-chart/trend-line-color-configuration',
    component: 'iot-app-kit-vis-scatter-chart-trend-line-color-configuration',
  },
  {
    url: '/tests/webgl-chart/colored-point',
    component: 'iot-app-kit-vis-line-chart-colored-point',
  },
  {
    url: '/tests/webgl-chart/multiple-lines',
    component: 'iot-app-kit-vis-multiple-lines',
  },
  {
    url: '/tests/webgl-chart/multiple-lines-overlapping',
    component: 'iot-app-kit-vis-multiple-lines-overlapping',
  },
  {
    url: '/tests/expandable-input/standard',
    component: 'iot-app-kit-vis-expandable-input-standard',
  },
  {
    url: '/tests/sizer-provider/size-provider-standard',
    component: 'iot-app-kit-vis-size-provider-standard',
  },
  {
    url: '/tests/webgl-bar-chart/standard',
    component: 'iot-app-kit-vis-webgl-bar-chart-standard',
  },
  {
    url: '/tests/webgl-chart/webgl-chart-dynamic-charts',
    component: 'iot-app-kit-vis-webgl-chart-dynamic-charts',
  },
  {
    url: '/tests/webgl-bar-chart/bar-chart-dynamic-data-streams',
    component: 'iot-app-kit-vis-webgl-bar-chart-dynamic-data-streams',
  },
  {
    url: '/tests/webgl-bar-chart/bar-chart-dynamic-data',
    component: 'iot-app-kit-vis-webgl-bar-chart-dynamic-data',
  },
  {
    url: '/tests/webgl-bar-chart/bar-chart-fast-viewport',
    component: 'iot-app-kit-vis-webgl-bar-chart-fast-viewport',
  },
  {
    url: '/tests/webgl-bar-chart/bar-chart-dynamic-buffer',
    component: 'iot-app-kit-vis-webgl-bar-chart-dynamic-buffer',
  },
  {
    url: '/tests/webgl-bar-chart/negative',
    component: 'iot-app-kit-vis-webgl-bar-chart-negative',
  },
  {
    url: '/tests/webgl-bar-chart/pos-neg',
    component: 'iot-app-kit-vis-webgl-bar-chart-positive-negative',
  },
  {
    url: '/tests/webgl-bar-chart/threshold/coloration',
    component: 'iot-app-kit-vis-webgl-bar-chart-threshold-coloration',
  },
  {
    url: '/tests/webgl-bar-chart/threshold/coloration-exact-point',
    component: 'iot-app-kit-vis-webgl-bar-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/webgl-bar-chart/threshold/coloration-multiple-data-stream',
    component: 'iot-app-kit-vis-webgl-bar-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/webgl-bar-chart/threshold/coloration-multiple-thresholds',
    component: 'iot-app-kit-vis-webgl-bar-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/webgl-bar-chart/threshold/no-coloration',
    component: 'iot-app-kit-vis-webgl-bar-chart-threshold-no-coloration',
  },
  {
    url: '/tests/webgl-bar-chart/threshold/coloration-band',
    component: 'iot-app-kit-vis-webgl-bar-chart-threshold-coloration-band',
  },
  {
    url: '/tests/webgl-chart/performance/line-chart-stream-data',
    component: 'iot-app-kit-vis-line-chart-stream-data',
  },
  {
    url: '/tests/lazily-load/lazily-load-standard',
    component: 'iot-app-kit-vis-lazily-load-standard',
  },
  {
    url: '/tests/lazily-load/lazily-load-web-component',
    component: 'iot-app-kit-vis-lazily-load-web-component',
  },
  {
    url: '/tests/webgl-bar-chart/margin',
    component: 'iot-app-kit-vis-webgl-bar-chart-margin',
  },
  {
    url: '/tests/webgl-chart/annotations/annotation-editable',
    component: 'iot-app-kit-vis-webgl-chart-annotation-editable',
  },
  {
    url: '/tests/webgl-chart/annotations/draggable-multi',
    component: 'iot-app-kit-vis-annotations-draggable-multi',
  },
  {
    url: '/tests/webgl-bar-chart/start-from-zero',
    component: 'iot-app-kit-vis-webgl-bar-chart-start-from-zero',
  },
  {
    url: '/tests/webgl-bar-chart/unsupported-data-types',
    component: 'iot-app-kit-vis-webgl-bar-chart-unsupported-data-types',
  },
  {
    url: '/tests/webgl-chart/annotations',
    component: 'iot-app-kit-vis-webgl-chart-annotations',
  },
  {
    url: '/tests/webgl-chart/threshold/coloration-split-half',
    component: 'iot-app-kit-vis-webgl-chart-threshold-coloration-split-half',
  },
  {
    url: '/tests/webgl-chart/threshold/coloration-exact-point',
    component: 'iot-app-kit-vis-webgl-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/webgl-chart/threshold/coloration-multiple-data-stream',
    component: 'iot-app-kit-vis-webgl-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/webgl-chart/threshold/coloration-multiple-thresholds',
    component: 'iot-app-kit-vis-webgl-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/webgl-chart/threshold/coloration-band',
    component: 'iot-app-kit-vis-webgl-chart-threshold-coloration-band',
  },
  {
    url: '/tests/webgl-chart/annotations/always-in-viewport',
    component: 'iot-app-kit-vis-webgl-chart-annotations-always-in-viewport',
  },
  {
    url: '/tests/webgl-chart/tooltip/multiple-data-streams',
    component: 'iot-app-kit-vis-webgl-chart-tooltip-with-multiple-data-streams',
  },
  {
    url: '/tests/scatter-chart/tooltip/multiple-data-streams-and-trends',
    component: 'iot-app-kit-vis-scatter-chart-tooltip-with-multiple-data-streams-and-trends',
  },
  {
    url: '/tests/scatter-chart/threshold/coloration',
    component: 'iot-app-kit-vis-scatter-chart-threshold',
  },
  {
    url: '/tests/scatter-chart/threshold/coloration-exact-point',
    component: 'iot-app-kit-vis-scatter-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/scatter-chart/threshold/coloration-multiple-data-stream',
    component: 'iot-app-kit-vis-scatter-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/scatter-chart/threshold/coloration-multiple-thresholds',
    component: 'iot-app-kit-vis-scatter-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/scatter-chart/threshold/coloration-band',
    component: 'iot-app-kit-vis-scatter-chart-threshold-coloration-band',
  },
  {
    url: '/tests/webgl-chart/axis',
    component: 'iot-app-kit-vis-webgl-chart-axis',
  },
  {
    url: '/tests/chart/y-range',
    component: 'iot-app-kit-vis-chart-y-range',
  },
  {
    url: '/tests/webgl-chart/annotations/no-annotations',
    component: 'iot-app-kit-vis-webgl-chart-no-annotations',
  },
  {
    url: '/tests/scatter-chart/threshold/no-coloration',
    component: 'iot-app-kit-vis-scatter-chart-threshold-no-coloration',
  },
  {
    url: '/tests/scatter-chart/unsupported-data-types',
    component: 'iot-app-kit-vis-scatter-chart-unsupported-data-types',
  },
  {
    url: '/tests/common-components/toggle',
    component: 'iot-app-kit-vis-toggle-test',
  },
  {
    url: '/tests/webgl-chart/single-status',
    component: 'single-status',
  },
  {
    url: '/tests/webgl-chart/single-colored-status',
    component: 'single-colored-status',
  },
  {
    url: '/tests/webgl-chart/multiple-statuses',
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
