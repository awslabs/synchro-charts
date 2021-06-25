/* eslint-disable import/first */
jest.mock('../../monitor-size-provider/renderChild');
jest.mock('../../monitor-webgl-context/webglContext');

import 'webgl-mock-threejs';
import { newChartSpecPage } from '../../../testing/chartDescriptions/newChartSpecPage';
import { describeChart } from '../../../testing/chartDescriptions/describeChart';

const lineChart = newChartSpecPage('monitor-line-chart');

describe('monitor-line-chart', () => {
  describeChart(lineChart);
});
