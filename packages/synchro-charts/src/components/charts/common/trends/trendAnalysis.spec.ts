import { DataStream } from '../../../../utils/dataTypes';
import { computeTrendResult, getAllTrendResults, getTrendValue } from './trendAnalysis';
import { TrendResult } from './types';
import { DataType, TREND_TYPE } from '../../../../utils/dataConstants';

describe('linear regression computation', () => {
  it('compute linear regression on zero points', () => {
    const stream: DataStream<number> = {
      id: 'zero points',
      name: 'some-stream',
      data: [],
      resolution: 0,
      dataType: DataType.NUMBER,
    };
    const result = computeTrendResult(stream, TREND_TYPE.LINEAR);
    expect(result).toBeNull();
  });

  it('compute linear regression on one point', () => {
    const stream: DataStream<number> = {
      id: 'one point',
      name: 'some-stream',
      data: [{ x: new Date(2020, 3, 17).getTime(), y: 23 }],
      resolution: 0,
      dataType: DataType.NUMBER,
    };
    const result = computeTrendResult(stream, TREND_TYPE.LINEAR) as TrendResult;
    expect(result.dataStreamId).toEqual(stream.id);
    expect(result.type).toEqual(TREND_TYPE.LINEAR);
    expect(result.equation).toEqual({ gradient: 0, intercept: 23 });
    expect(result.startDate.getTime()).toEqual(stream.data[0].x);
  });

  it('compute linear regression on a DataStream of two points with the same y-value', () => {
    const stream: DataStream<number> = {
      id: 'two points',
      name: 'some-stream',
      data: [{ x: new Date(2020, 1, 1).getTime(), y: 100 }, { x: new Date(2020, 2, 1).getTime(), y: 100 }],
      resolution: 0,
      dataType: DataType.NUMBER,
    };
    const result = computeTrendResult(stream, TREND_TYPE.LINEAR) as TrendResult;
    expect(result.dataStreamId).toEqual(stream.id);
    expect(result.type).toEqual(TREND_TYPE.LINEAR);
    expect(result.equation).toEqual({ gradient: 0, intercept: 100 });
    expect(result.startDate.getTime()).toEqual(stream.data[0].x);
  });

  it('compute linear regression on a DataStream of three collinear points', () => {
    const stream: DataStream<number> = {
      id: 'three points',
      name: 'some-stream',
      data: [
        { x: new Date(2020, 1, 1).getTime(), y: 10 },
        { x: new Date(2020, 1, 4).getTime(), y: 19 },
        { x: new Date(2020, 1, 3).getTime(), y: 16 },
      ],
      resolution: 0,
      dataType: DataType.NUMBER,
    };
    const result = computeTrendResult(stream, TREND_TYPE.LINEAR) as TrendResult;
    expect(result.dataStreamId).toEqual(stream.id);
    expect(result.type).toEqual(TREND_TYPE.LINEAR);
    expect(result.equation.gradient.toPrecision(6)).toEqual('3.47222e-8');
    expect(result.equation.intercept).toEqual(10);
    expect(result.startDate.getTime()).toEqual(stream.data[0].x);
  });

  it('compute linear regression on a DataStream of ten points', () => {
    const stream: DataStream<number> = {
      id: 'ten points',
      name: 'some-stream',
      data: [
        { x: new Date(2020, 1, 0).getTime(), y: 3 },
        { x: new Date(2020, 1, 1).getTime(), y: 3 },
        { x: new Date(2020, 1, 2).getTime(), y: 4 },
        { x: new Date(2020, 1, 3).getTime(), y: 10 },
        { x: new Date(2020, 1, 6).getTime(), y: 12 },
        { x: new Date(2020, 1, 4).getTime(), y: 5 },
        { x: new Date(2020, 1, 0).getTime(), y: 0 },
        { x: new Date(2020, 1, 5).getTime(), y: 5 },
        { x: new Date(2020, 1, 10).getTime(), y: 12 },
        { x: new Date(2020, 1, 15).getTime(), y: 17 },
      ],
      resolution: 0,
      dataType: DataType.NUMBER,
    };
    const result = computeTrendResult(stream, TREND_TYPE.LINEAR) as TrendResult;
    expect(result.dataStreamId).toEqual(stream.id);
    expect(result.type).toEqual(TREND_TYPE.LINEAR);
    expect(result.equation.gradient.toPrecision(6)).toEqual('1.16873e-8');
    expect(result.equation.intercept.toPrecision(6)).toEqual('2.45499');
    expect(result.startDate.getTime()).toEqual(stream.data[0].x);
  });
});

describe('no trend results', () => {
  it('does not compute trend result when data is completely to one side of viewport', async () => {
    const viewPort = {
      start: new Date(2019, 0, 1),
      end: new Date(2019, 11, 1),
      yMin: -50,
      yMax: 50,
    };
    const streams: DataStream<number>[] = [
      {
        id: 'data on one side of viewport',
        name: 'some-stream',
        data: [
          // all points are to the left of viewport
          { x: new Date(2018, 3, 6).getTime(), y: 10 },
          { x: new Date(2018, 4, 8).getTime(), y: 5 },
          { x: new Date(2018, 5, 10).getTime(), y: 2 },
        ],
        resolution: 0,
        dataType: DataType.NUMBER,
      },
    ];
    const trends = [
      {
        dataStreamId: 'data on one side of viewport',
        type: TREND_TYPE.LINEAR,
      },
    ];
    const trendResults = getAllTrendResults(viewPort, streams, trends);

    expect(trendResults).toHaveLength(0);
  });

  it('does not compute trend result when there is a single data point, which is inside the viewport', async () => {
    const viewPort = {
      start: new Date(2019, 0, 1),
      end: new Date(2019, 11, 1),
      yMin: -50,
      yMax: 50,
    };
    const streams: DataStream<number>[] = [
      {
        id: 'one point',
        name: 'some-stream',
        data: [{ x: new Date(2019, 5, 25).getTime(), y: 10 }],
        resolution: 0,
        dataType: DataType.NUMBER,
      },
    ];
    const trends = [
      {
        dataStreamId: 'one point',
        type: TREND_TYPE.LINEAR,
      },
    ];
    const trendResults = getAllTrendResults(viewPort, streams, trends);

    expect(trendResults).toHaveLength(0);
  });
});

describe('get all trend results', () => {
  it('computes multiple trend results', async () => {
    const viewPort = {
      start: new Date(2020, 0, 0),
      end: new Date(2020, 1, 12),
      yMin: -50,
      yMax: 50,
    };
    const streams: DataStream<number>[] = [
      {
        id: 'three points in viewport',
        data: [
          { x: new Date(2020, 1, 1).getTime(), y: 10 },
          { x: new Date(2020, 1, 4).getTime(), y: 19 },
          { x: new Date(2020, 1, 3).getTime(), y: 16 },
        ],
        resolution: 0,
        name: 'some-stream',
        dataType: DataType.NUMBER,
      },
      {
        id: 'ten points in viewport',
        name: 'some-stream',
        data: [
          { x: new Date(2020, 1, 0).getTime(), y: 3 },
          { x: new Date(2020, 1, 1).getTime(), y: 3 },
          { x: new Date(2020, 1, 2).getTime(), y: 4 },
          { x: new Date(2020, 1, 3).getTime(), y: 10 },
          { x: new Date(2020, 1, 6).getTime(), y: 12 },
          { x: new Date(2020, 1, 4).getTime(), y: 5 },
          { x: new Date(2020, 1, 0).getTime(), y: 0 },
          { x: new Date(2020, 1, 5).getTime(), y: 5 },
          { x: new Date(2020, 1, 10).getTime(), y: 12 },
          { x: new Date(2020, 1, 15).getTime(), y: 17 }, // boundary point
          { x: new Date(2020, 1, 17).getTime(), y: 1 },
        ],
        resolution: 0,
        dataType: DataType.NUMBER,
      },
    ];
    const trends = [
      {
        dataStreamId: 'three points in viewport',
        type: TREND_TYPE.LINEAR,
      },
      {
        dataStreamId: 'ten points in viewport',
        type: TREND_TYPE.LINEAR,
      },
    ];
    const trendResults = getAllTrendResults(viewPort, streams, trends);

    expect(trendResults).toHaveLength(2);

    expect(trendResults[0].dataStreamId).toEqual(streams[0].id);
    expect(trendResults[0].type).toEqual(trends[0].type);
    expect(trendResults[0].equation.gradient.toPrecision(6)).toEqual('3.47222e-8');
    expect(trendResults[0].equation.intercept).toEqual(10);
    expect(trendResults[0].startDate.getTime()).toEqual(streams[0].data[0].x);

    expect(trendResults[1].dataStreamId).toEqual(streams[1].id);
    expect(trendResults[1].type).toEqual(trends[1].type);
    expect(trendResults[1].equation.gradient.toPrecision(6)).toEqual('1.16873e-8');
    expect(trendResults[1].equation.intercept.toPrecision(6)).toEqual('2.45499');
    expect(trendResults[1].startDate.getTime()).toEqual(streams[1].data[0].x);
  });
});

describe('get correct trend value', () => {
  it('linear regression', async () => {
    const trendResult = {
      type: TREND_TYPE.LINEAR,
      dataStreamId: 'some id',
      equation: {
        gradient: 5,
        intercept: 7,
      },
      startDate: new Date(2020, 2, 20),
    };

    expect(getTrendValue(trendResult, new Date(2020, 2, 21).getTime())).toEqual(432000007);
  });
});
