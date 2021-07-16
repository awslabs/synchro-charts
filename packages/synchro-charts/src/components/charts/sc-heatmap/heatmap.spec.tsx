/* eslint-disable import/first */
jest.mock('../../sc-size-provider/renderChild');
jest.mock('../../sc-webgl-context/webglContext');

import 'webgl-mock-threejs';
import { newChartSpecPage } from '../../../testing/chartDescriptions/newChartSpecPage';
import { describeChart } from '../../../testing/chartDescriptions/describeChart';

const heatmap = newChartSpecPage('sc-heatmap');

describe('sc-heatmap', () => {
  describeChart(heatmap);
});
