/* eslint-disable import/first */
import { Annotations } from '../common/types';

jest.mock('../../sc-size-provider/renderChild');
jest.mock('../../sc-webgl-context/webglContext');

import 'webgl-mock-threejs';
import { newChartSpecPage } from '../../../testing/chartDescriptions/newChartSpecPage';
import { describeChart } from '../../../testing/chartDescriptions/describeChart';

const statusChart = newChartSpecPage('sc-status-chart');

describe('sc-status-chart', () => {
  describeChart(statusChart, {
    yRange: true,
    viewport: true,
    trends: true,
    annotations: true,
    legend: true,
  });
});

describe('annotations', () => {
  it('is set correctly', async () => {
    const ANNOTATIONS: Annotations = {
      x: [
        {
          color: 'red',
          value: new Date(),
        },
      ],
      show: true,
    };

    const { chart } = await statusChart({ annotations: ANNOTATIONS });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.annotations).toMatchObject({
      ...ANNOTATIONS,
      show: false,
      thresholdOptions: {
        showColor: true,
      },
    });
  });
});
