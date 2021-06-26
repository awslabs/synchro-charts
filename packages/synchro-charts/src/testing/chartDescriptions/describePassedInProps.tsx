import { ChartSpecPage, DisableList } from './newChartSpecPage';
import { Trend } from '../../components/charts/common/trends/types';
import { HOUR_IN_MS } from '../../utils/time';
import { LEGEND_POSITION } from '../../components/charts/common/constants';
import { TREND_TYPE } from '../../utils/dataConstants';
import { Annotations, Axis } from '../../components/charts/common/types';

export const describePassedInProps = (newChartSpecPage: ChartSpecPage, disableList: DisableList) => {
  describe('properties pass down correctly to chart implementation', () => {
    describe('alarms', () => {
      it('passes down', async () => {
        const alarms = { expires: HOUR_IN_MS };
        const { chart } = await newChartSpecPage({ alarms });
        const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

        expect(baseChart.alarms).toBe(alarms);
      });
    });

    describe('messageOverrides', () => {
      it('passes down', async () => {
        const messageOverrides = { noDataStreamsPresentHeader: 'an over ride message' };
        const { chart } = await newChartSpecPage({ messageOverrides });
        const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

        expect(baseChart.messageOverrides).toBe(messageOverrides);
      });
    });

    describe('gestures', () => {
      it('passes gestures down as true', async () => {
        const { chart } = await newChartSpecPage({ gestures: true });
        const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

        expect(baseChart.gestures).toBeTrue();
      });

      it('passes gestures down as false', async () => {
        const { chart } = await newChartSpecPage({ gestures: false });
        const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

        expect(baseChart.gestures).toBeFalse();
      });
    });

    describe('supports strings', () => {
      it('sets the provided option supportsStrings', async () => {
        const { chart } = await newChartSpecPage({});
        const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

        expect(baseChart.supportString).toBeDefined();
      });
    });

    if (!disableList.viewport) {
      describe('View Port', () => {
        it('sets the provided viewport, and has a y range set when viewport has none provided', async () => {
          const VIEW_PORT = {
            start: new Date(2000, 0, 0),
            end: new Date(2001, 0, 0),
          };

          const { chart } = await newChartSpecPage({ viewPort: VIEW_PORT });
          const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

          /** Start and end date is equal to what was provided */
          expect(baseChart.viewPort).toEqual(expect.objectContaining(VIEW_PORT));

          /** Y Range set since viewport had none provided */
          expect(baseChart.viewPort.yMin).not.toBeDefined();
          expect(baseChart.viewPort.yMax).not.toBeDefined();
        });
      });
    }

    if (!disableList.legend) {
      describe('Legend', () => {
        it('is set correctly', async () => {
          const LEGEND = {
            position: LEGEND_POSITION.BOTTOM,
            width: 200,
          };

          const { chart } = await newChartSpecPage({ legend: LEGEND });
          const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

          expect(baseChart.legend).toEqual(LEGEND);
        });
      });
    }

    if (!disableList.trends) {
      describe('trend infos', () => {
        it('is set correctly', async () => {
          const TRENDS: Trend[] = [
            {
              dataStreamId: 'some-id',
              type: TREND_TYPE.LINEAR,
            },
          ];

          const { chart } = await newChartSpecPage({ trends: TRENDS });
          const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

          expect(baseChart.trends).toEqual(TRENDS);
        });
      });
    }

    if (!disableList.annotations) {
      describe('annotations', () => {
        it('is set correctly', async () => {
          const ANNOTATIONS: Annotations = {
            x: [
              {
                color: 'red',
                value: new Date(),
              },
            ],
          };

          const { chart } = await newChartSpecPage({ annotations: ANNOTATIONS });
          const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

          expect(baseChart.annotations).toEqual(ANNOTATIONS);
        });
      });
    }

    describe('axis', () => {
      it('is set correctly', async () => {
        const AXIS: Axis.Options = {
          showX: true,
          showY: false,
        };

        const { chart } = await newChartSpecPage({ axis: AXIS });
        const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

        expect(baseChart.axis).toEqual(AXIS);
      });
    });

    describe('request data', () => {
      it('sets the requested data', async () => {
        const requestData = jest.fn();

        const { chart } = await newChartSpecPage({ requestData });
        const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

        expect(baseChart.requestData).toBe(requestData);
      });
    });
  });
};
