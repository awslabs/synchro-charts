import { ChartSpecPage } from './newChartSpecPage';
import { DataStream } from '../../utils/dataTypes';
import { DataType, TREND_TYPE } from '../../utils/dataConstants';

const VIEWPORT = {
  start: new Date(2019, 0, 0),
  end: new Date(2020, 0, 0),
  yMin: -50,
  yMax: 50,
};

const DATA_STREAMS: DataStream[] = [
  {
    id: 'test-data',
    name: 'Sample Data',
    color: '#123456',
    data: [
      {
        x: new Date(2018, 1, 1).getTime(),
        y: 10,
      },
      {
        x: new Date(2019, 1, 1).getTime(),
        y: 15,
      },
      {
        x: new Date(2019, 3, 10).getTime(),
        y: 19,
      },
      {
        x: new Date(2019, 5, 15).getTime(),
        y: 22,
      },
      {
        x: new Date(2019, 8, 25).getTime(),
        y: 27,
      },
      {
        x: new Date(2020, 10, 1).getTime(),
        y: 33,
      },
    ],
    resolution: 0,
    dataType: DataType.NUMBER,
  },
];

export const describeTrendLines = (newChartSpecPage: ChartSpecPage) => {
  describe('regression', () => {
    it('chart renders regression with the correct properties', async () => {
      const { chart } = await newChartSpecPage({
        viewport: VIEWPORT,
        dataStreams: DATA_STREAMS,
        trends: [
          {
            dataStreamId: DATA_STREAMS[0].id,
            type: TREND_TYPE.LINEAR,
          },
        ],
      });

      const regression = chart.querySelectorAll('path.linear-regression');
      expect(regression).toHaveLength(1);
      expect(regression[0].getAttribute('stroke')).toEqual(DATA_STREAMS[0].color);
    });
  });
};
