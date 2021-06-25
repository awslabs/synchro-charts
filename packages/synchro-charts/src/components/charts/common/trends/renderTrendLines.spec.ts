import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { renderTrendLines } from './renderTrendLines';
import { DataStream, Primitive } from '../../../../utils/dataTypes';
import { RenderTrendLinesOptions } from './types';
import { DataType, TREND_TYPE } from '../../../../utils/dataConstants';

const VIEWPORT = {
  start: new Date(2019, 2, 0),
  end: new Date(2019, 8, 0),
  yMin: -50,
  yMax: 50,
};

const SIZE = {
  width: 300,
  height: 200,
};

const DATA_STREAMS: DataStream<Primitive>[] = [
  {
    id: 'test-data-1',
    name: 'Sample Data 1',
    resolution: 0,
    data: [],
    color: '#244668',
    dataType: DataType.NUMBER,
  },
  {
    id: 'test-data-2',
    name: 'Sample Data 2',
    resolution: 0,
    data: [],
    color: '#dd0033',
    dataType: DataType.NUMBER,
  },
];

const render = (props: Partial<RenderTrendLinesOptions>, page: SpecPage) => {
  const defaultProps: RenderTrendLinesOptions = {
    container: page.body.querySelector('svg') as SVGElement,
    viewPort: VIEWPORT,
    size: SIZE,
    dataStreams: [],
    trendResults: [],
  };

  renderTrendLines({
    ...defaultProps,
    ...props,
  });
};

const newTrendLinesPage = async (props: Partial<RenderTrendLinesOptions>) => {
  const page = await newSpecPage({
    components: [],
    html: '<svg viewBox="0 0 200 150"></svg>',
    supportsShadowDom: false,
  });

  await page.waitForChanges();
  render(props, page);
  await page.waitForChanges();
  return { page };
};

describe('no trend lines', () => {
  it('renders no trend lines when no data stream info nor trend result provided', async () => {
    const { page } = await newTrendLinesPage({});
    expect(page.body.querySelectorAll('path.linear-regression')).toBeEmpty();
  });

  it('renders no trend lines when trend result provided but no data stream info provided', async () => {
    const { page } = await newTrendLinesPage({
      trendResults: [
        {
          dataStreamId: DATA_STREAMS[0].id,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 1e-9,
            intercept: 5,
          },
          startDate: new Date(2019, 3, 0),
        },
      ],
    });
    expect(page.body.querySelectorAll('path.linear-regression')).toBeEmpty();
  });

  it('renders no trend lines when data stream info provided but no trend result provided', async () => {
    const { page } = await newTrendLinesPage({
      dataStreams: [DATA_STREAMS[0]],
    });
    expect(page.body.querySelectorAll('path.linear-regression')).toBeEmpty();
  });

  it('renders no trend lines when data stream info provided but trend result is associated to a different id', async () => {
    const { page } = await newTrendLinesPage({
      dataStreams: [DATA_STREAMS[0]],
      trendResults: [
        {
          dataStreamId: DATA_STREAMS[1].id,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 1e-9,
            intercept: 5,
          },
          startDate: new Date(2019, 3, 0),
        },
      ],
    });
    expect(page.body.querySelectorAll('path.linear-regression')).toBeEmpty();
  });
});

describe('one linear regression', () => {
  it('renders correctly', async () => {
    const { page } = await newTrendLinesPage({
      dataStreams: [DATA_STREAMS[0]],
      trendResults: [
        {
          dataStreamId: DATA_STREAMS[0].id,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 5.816626043823801e-10,
            intercept: 15.247006432459179,
          },
          startDate: new Date(2019, 1, 1),
        },
      ],
    });

    // exactly one path should exist
    const paths = page.body.querySelectorAll('path.linear-regression');
    expect(paths).toHaveLength(1);

    // check properties
    expect(paths[0].getAttribute('stroke')).toEqual(DATA_STREAMS[0].color);
    expect(paths[0].getAttribute('d')).toEqual('M 0 67 L 300 48');
    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('only renders provided trend result when multiple data stream infos are provided', async () => {
    const { page } = await newTrendLinesPage({
      dataStreams: DATA_STREAMS,
      trendResults: [
        {
          dataStreamId: DATA_STREAMS[0].id,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 5.816626043823801e-10,
            intercept: 15.247006432459179,
          },
          startDate: new Date(2019, 1, 1),
        },
      ],
    });

    // exactly one path should exist
    const paths = page.body.querySelectorAll('path.linear-regression');
    expect(paths).toHaveLength(1);

    // check properties
    expect(paths[0].getAttribute('stroke')).toEqual(DATA_STREAMS[0].color);
    expect(paths[0].getAttribute('d')).toEqual('M 0 67 L 300 48');
  });
});

describe('two linear regressions', () => {
  it('renders correctly', async () => {
    const { page } = await newTrendLinesPage({
      dataStreams: DATA_STREAMS.slice(0, 2),
      trendResults: [
        {
          dataStreamId: DATA_STREAMS[0].id,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 5.816626043823801e-10,
            intercept: 15.247006432459179,
          },
          startDate: new Date(2019, 1, 1),
        },
        {
          dataStreamId: DATA_STREAMS[1].id,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: -9.188994593819845e-10,
            intercept: 2.185874954649897,
          },
          startDate: new Date(2019, 3, 3),
        },
      ],
    });

    // exactly two paths should exist
    const paths = page.body.querySelectorAll('path.linear-regression');
    expect(paths).toHaveLength(2);

    // stream 1 regression
    expect(paths[0].getAttribute('stroke')).toEqual(DATA_STREAMS[0].color);
    expect(paths[0].getAttribute('d')).toEqual('M 0 67 L 300 48');

    // stream 2 regression
    expect(paths[1].getAttribute('stroke')).toEqual(DATA_STREAMS[1].color);
    expect(paths[1].getAttribute('d')).toEqual('M 0 90 L 300 119');
  });
});
