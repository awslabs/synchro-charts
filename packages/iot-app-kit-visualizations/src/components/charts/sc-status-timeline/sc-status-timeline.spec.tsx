/* eslint-disable import/first */
import { Annotations } from '../common/types';

jest.mock('../../sc-size-provider/renderChild');
jest.mock('../../sc-webgl-context/webglContext');

import 'webgl-mock-threejs';
import { newChartSpecPage } from '../../../testing/chartDescriptions/newChartSpecPage';
import { describeChart } from '../../../testing/chartDescriptions/describeChart';

const statusTimeline = newChartSpecPage('iot-app-kit-vis-status-timeline');

describe('status-timeline', () => {
  describeChart(statusTimeline, {
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

    const { chart } = await statusTimeline({ annotations: ANNOTATIONS });
    const baseChart = chart.querySelector('iot-app-kit-vis-webgl-base-chart') as HTMLIotAppKitVisWebglBaseChartElement;

    expect(baseChart.annotations).toMatchObject({
      ...ANNOTATIONS,
      show: false,
      thresholdOptions: {
        showColor: true,
      },
    });
  });
});
