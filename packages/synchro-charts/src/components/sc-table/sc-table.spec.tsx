import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../components.d';
import { DataPoint, DataStream, DataStreamInfo, MinimalLiveViewport, TableColumn } from '../../utils/dataTypes';
import { MINUTE_IN_MS } from '../../utils/time';
import { CustomHTMLElement } from '../../utils/types';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { update } from '../charts/common/tests/merge';
import { ScTable } from './sc-table';
import { ScTableCell } from './sc-table-cell/sc-table-cell';
import { ERROR_SYMBOL_SELECTOR, LOADING_SPINNER_SELECTOR } from '../../testing/selectors';
import { ScTableBase } from './sc-table-base/sc-table-base';
import { ScChartIcon } from '../charts/chart-icon/sc-chart-icon';
import { NO_VALUE_PRESENT } from '../common/terms';
import { DataType } from '../../utils/dataConstants';

const STREAM_1: DataStream<string> = {
  id: 'rule-cell-id-1',
  dataType: DataType.STRING,
  color: 'black',
  name: 'rule row 1',
  data: [{ x: new Date(2000, 0, 0).getTime(), y: 'y < 30' }],
  resolution: 0,
};
const STREAM_2: DataStream<number> = {
  id: 'severity-cell-id-1',
  dataType: DataType.NUMBER,
  color: 'black',
  name: 'sev row 1',
  data: [{ x: new Date(2000, 0, 0).getTime(), y: 3 }],
  resolution: 0,
};
const STREAM_3: DataStream<string> = {
  id: 'alarm-cell-id-1',
  dataType: DataType.STRING,
  color: 'red',
  name: 'D alarm',
  data: [{ x: new Date(2000, 0, 0).getTime(), y: 'normal' }],
  resolution: 0,
};

const TABLE_COLUMNS: TableColumn[] = [
  { header: 'Rule', rows: [STREAM_1.id] },
  { header: 'Severity', rows: [STREAM_2.id] },
  { header: 'Alarm', rows: [STREAM_3.id] },
];

const VIEWPORT: MinimalLiveViewport = {
  yMin: DEFAULT_CHART_CONFIG.viewport.yMin,
  yMax: DEFAULT_CHART_CONFIG.viewport.yMax,
  duration: MINUTE_IN_MS,
};
const WIDGET_ID = 'test-widget-it';

const tableSpecPage = async (propOverrides: Partial<Components.ScTable> = {}) => {
  const page = await newSpecPage({
    components: [ScTable, ScTableBase, ScTableCell, ScChartIcon],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const table = page.doc.createElement('sc-table') as CustomHTMLElement<Components.ScTable>;
  const props: Partial<Components.ScTable> = {
    dataStreams: [],
    tableColumns: [],
    widgetId: WIDGET_ID,
    viewport: VIEWPORT,
    annotations: {},
    trends: [],
    ...propOverrides,
  };

  update(table, props);
  page.body.appendChild(table);

  await page.waitForChanges();

  return { page, table };
};

describe('rendering', () => {
  it('renders empty table', async () => {
    const { table } = await tableSpecPage();

    const tableBase = table.querySelectorAll('sc-table-base');
    expect(tableBase).toHaveLength(1);

    const cells = table.querySelectorAll('sc-table-cell');
    expect(cells).toBeEmpty();
  });

  it('renders latest value', async () => {
    const INFO: DataStreamInfo = {
      id: 'my-id',
      resolution: 0,
      name: 'my-name',
      color: 'blue',
      dataType: DataType.STRING,
    };

    const EARLIER_POINT: DataPoint<string> = {
      x: new Date(2000, 0, 1).getTime(),
      y: 'EARLIER POINT',
    };

    const LATER_POINT: DataPoint<string> = {
      x: new Date(2000, 0, 10).getTime(),
      y: 'LATER POINT',
    };

    const STREAM: DataStream<string> = {
      id: INFO.id,
      name: 'my-name',
      color: 'blue',
      dataType: DataType.STRING,
      resolution: 0,
      // NOTE: data streams must be chronologically ordered, oldest to most recent (first item is the furthest back in time).
      data: [EARLIER_POINT, LATER_POINT],
    };

    const { table } = await tableSpecPage({
      tableColumns: [{ header: 'my column', rows: [INFO.id] }],
      dataStreams: [STREAM],
    });

    const cells = table.querySelectorAll('sc-table-cell');
    expect(cells).toHaveLength(1);

    const cell = cells[0];
    expect(cell.innerHTML).toContain(LATER_POINT.y);
    expect(cell.innerHTML).not.toContain(EARLIER_POINT.y);
  });

  describe('mismatching number of rows between columns', () => {
    it('renders a cell for every blank rows', async () => {
      const { table } = await tableSpecPage({
        tableColumns: [
          {
            header: '1',
            rows: [undefined, undefined, undefined],
          },
          {
            header: '2',
            rows: [],
          },
        ],
      });

      const cells = table.querySelectorAll('td');
      expect(cells.length).toBe(6); // 2 x 3 table
    });

    it('renders a cell for every blank rows when both streams have only blank rows', async () => {
      const { table } = await tableSpecPage({
        tableColumns: [
          {
            header: '1',
            rows: [undefined, undefined, undefined],
          },
          {
            header: '2',
            rows: [undefined],
          },
        ],
      });

      const cells = table.querySelectorAll('td');
      expect(cells.length).toBe(6); // 2 x 3 table
    });

    it('renders a cell for every blank rows when both streams have only invalid data stream ids', async () => {
      const { table } = await tableSpecPage({
        tableColumns: [
          {
            header: '1',
            rows: ['invalid', undefined, 'invalid-2', undefined],
          },
          {
            header: '2',
            rows: [undefined],
          },
        ],
      });

      const cells = table.querySelectorAll('td');
      expect(cells.length).toBe(8); // 2 x 4 table
    });
  });

  it('table with data', async () => {
    const { table } = await tableSpecPage({
      dataStreams: [STREAM_1, STREAM_3, STREAM_3],
      tableColumns: TABLE_COLUMNS,
    });

    const cells = table.querySelectorAll('td');
    expect(cells).toHaveLength(3); // 1 x 3 table
  });

  it('renders table column headers when no rows present', async () => {
    const { table } = await tableSpecPage({
      dataStreams: [STREAM_1, STREAM_3, STREAM_3],
      tableColumns: TABLE_COLUMNS.map(c => ({ ...c, rows: [] })),
    });

    const headers = table.querySelectorAll('th');
    expect(headers).toHaveLength(TABLE_COLUMNS.length);

    const rows = table.querySelectorAll('tr');
    expect(rows).toHaveLength(1);
  });

  it('table with no data streams present does not show the "no value present indicator"', async () => {
    const { table } = await tableSpecPage({
      dataStreams: [],
      tableColumns: TABLE_COLUMNS,
    });

    const cells = table.querySelectorAll('td');
    expect(cells).toHaveLength(3);

    expect(cells[0].innerHTML).not.toBe(NO_VALUE_PRESENT);
    expect(cells[1].innerHTML).not.toBe(NO_VALUE_PRESENT);
    expect(cells[2].innerHTML).not.toBe(NO_VALUE_PRESENT);
  });

  it('renders table columns when provided only columns with no rows', async () => {
    const COLUMN: TableColumn = { header: 'my header', rows: [] };
    const { table } = await tableSpecPage({
      dataStreams: [],
      tableColumns: [COLUMN],
    });

    expect(table.querySelectorAll('th')).toHaveLength(1);
    expect(table.querySelectorAll('tr')).toHaveLength(1);
    expect((table.querySelector('th') as HTMLElement).innerHTML).toContain(COLUMN.header);
  });

  it('table with no data present shows the "no value present indicator"', async () => {
    const { table } = await tableSpecPage({
      dataStreams: [
        { ...STREAM_1, data: [] },
        { ...STREAM_2, data: [] },
        { ...STREAM_3, data: [] },
      ],
      tableColumns: TABLE_COLUMNS,
    });

    const cells = table.querySelectorAll('td');
    expect(cells).toHaveLength(3);

    expect(cells[0].innerHTML).toContain(NO_VALUE_PRESENT);
    expect(cells[1].innerHTML).toContain(NO_VALUE_PRESENT);
    expect(cells[2].innerHTML).toContain(NO_VALUE_PRESENT);
  });

  it('table with data present does not show the no value present indicator', async () => {
    const { table } = await tableSpecPage({
      dataStreams: [STREAM_3, STREAM_2, STREAM_1],
      tableColumns: TABLE_COLUMNS,
    });

    const cells = table.querySelectorAll('sc-table-cell');
    expect(cells).toHaveLength(3);

    expect(cells[0].innerHTML).not.toContain(NO_VALUE_PRESENT);
    expect(cells[1].innerHTML).not.toContain(NO_VALUE_PRESENT);
    expect(cells[2].innerHTML).not.toContain(NO_VALUE_PRESENT);
  });

  it('while in a historical time frame, only display table header and disable status', async () => {
    const NON_LIVE_VIEWPORT = {
      ...DEFAULT_CHART_CONFIG.viewport,
    };

    const { table } = await tableSpecPage({
      dataStreams: [],
      tableColumns: TABLE_COLUMNS,
      viewport: NON_LIVE_VIEWPORT,
    });

    const headers = table.querySelectorAll('th');
    expect(headers).toHaveLength(TABLE_COLUMNS.length);

    expect(table.querySelector('tbody')).toBeNull();
    expect(table.querySelector('.disable-status')).not.toBeNull();
  });

  it('while in a historical time frame, only display `liveModeOnlyMessage` for disable status', async () => {
    const NON_LIVE_VIEWPORT = {
      ...DEFAULT_CHART_CONFIG.viewport,
    };
    const LIVE_MODE_MSG = 'liveModeOnlyMessage';
    const { table } = await tableSpecPage({
      dataStreams: [],
      tableColumns: TABLE_COLUMNS,
      viewport: NON_LIVE_VIEWPORT,
      messageOverrides: {
        liveModeOnlyMessage: LIVE_MODE_MSG,
      },
    });

    const headers = table.querySelectorAll('th');
    expect(headers).toHaveLength(TABLE_COLUMNS.length);
    expect(table.querySelector('tbody')).toBeNull();

    const disableStatus = table.querySelector('.disable-status') as HTMLElement;
    expect(disableStatus).not.toBeNull();
    expect(disableStatus.innerText).toEqual('liveModeOnlyMessage');
  });

  it('table with no datastreamInfo shows only table header and empty status', async () => {
    const COLUMN: TableColumn = { header: 'my header', rows: [] };
    const { table } = await tableSpecPage({
      dataStreams: [],
      tableColumns: [COLUMN],
    });

    expect(table.querySelectorAll('th')).toHaveLength(1);
    expect(table.querySelectorAll('tr')).toHaveLength(1);
    expect((table.querySelector('th') as HTMLElement).innerHTML).toContain(COLUMN.header);
    expect(table.querySelectorAll('.empty-status')).not.toBeNull();
  });
});

describe('error status', () => {
  it('renders no error when no streams are in error', async () => {
    const { table } = await tableSpecPage({
      dataStreams: [STREAM_1, STREAM_2, STREAM_3],
      tableColumns: TABLE_COLUMNS,
    });

    const errors = table.querySelectorAll(ERROR_SYMBOL_SELECTOR);
    expect(errors).toBeEmpty();
  });

  it('renders error when stream is in error', async () => {
    const { table } = await tableSpecPage({
      dataStreams: [{ ...STREAM_1, error: 'some-error' }, STREAM_2, STREAM_3],
      tableColumns: TABLE_COLUMNS,
    });

    const errors = table.querySelectorAll(ERROR_SYMBOL_SELECTOR);
    expect(errors).toHaveLength(1);
  });

  it('renders multiple errors when multiple streams have errors', async () => {
    const { table } = await tableSpecPage({
      tableColumns: TABLE_COLUMNS,
      dataStreams: [{ ...STREAM_1, error: 'some-error' }, { ...STREAM_2, error: 'some-error-2' }, STREAM_3],
    });

    const errors = table.querySelectorAll(ERROR_SYMBOL_SELECTOR);
    expect(errors).toHaveLength(2);
  });

  it('renders only error when error and is loading at same time', async () => {
    const { table } = await tableSpecPage({
      tableColumns: TABLE_COLUMNS,
      dataStreams: [{ ...STREAM_1, error: 'some-error', isLoading: true, isRefreshing: true }, STREAM_2, STREAM_3],
    });

    const loadingSpinners = table.querySelectorAll(LOADING_SPINNER_SELECTOR);
    expect(loadingSpinners).toBeEmpty();

    const errors = table.querySelectorAll(ERROR_SYMBOL_SELECTOR);
    expect(errors).not.toBeEmpty();
  });
});

describe('loading and refreshing status', () => {
  it('renders no loading spinners when no streams are loading', async () => {
    const { table } = await tableSpecPage({
      tableColumns: TABLE_COLUMNS,
      dataStreams: [STREAM_1, STREAM_2, STREAM_3],
    });

    const loadingSpinners = table.querySelectorAll(LOADING_SPINNER_SELECTOR);
    expect(loadingSpinners).toBeEmpty();
  });

  it('renders no loading spinners when no streams are only refreshing', async () => {
    const { table } = await tableSpecPage({
      tableColumns: TABLE_COLUMNS,
      dataStreams: [{ ...STREAM_1, isRefreshing: true }, STREAM_2, STREAM_3],
    });

    const loadingSpinners = table.querySelectorAll(LOADING_SPINNER_SELECTOR);
    expect(loadingSpinners).toBeEmpty();
  });

  it('renders as loading when `isLoading` is true', async () => {
    const { table } = await tableSpecPage({
      tableColumns: TABLE_COLUMNS,
      dataStreams: [{ ...STREAM_1, isLoading: true }, STREAM_2, STREAM_3],
    });

    const loadingSpinners = table.querySelectorAll(LOADING_SPINNER_SELECTOR);
    expect(loadingSpinners).toHaveLength(1);
  });

  it('renders a loading spinner per loading stream', async () => {
    const { table } = await tableSpecPage({
      tableColumns: TABLE_COLUMNS,
      dataStreams: [{ ...STREAM_1, isLoading: true }, { ...STREAM_2, isLoading: true }, STREAM_3],
    });

    const loadingSpinners = table.querySelectorAll(LOADING_SPINNER_SELECTOR);
    expect(loadingSpinners).toHaveLength(2);
  });
});
