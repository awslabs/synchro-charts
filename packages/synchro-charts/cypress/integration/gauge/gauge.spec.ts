import { COMPARISON_OPERATOR, DataType, NO_VALUE_PRESENT, StatusIcon, StreamType } from '../../../src/constants';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import { Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';

const VALUE_ERROR = '[data-testid="warning"]';
const VALUE_LOADING = '[data-testid="loading"]';
const VALUE_SVG = '[data-testid="current-value"]';
const errorMessage = 'SiteWise network error';

const VIEWPORT = { duration: undefined, yMin: Y_MIN, yMax: Y_MAX };

const GAUGLE_SIZE = {
  fontSize: 50,
  gaugeThickness: 30,
  iconSize: 30,
  labelSize: 20,
  unitSize: 30,
};

const DATASTREAM = {
  id: 'test-gauge-id',
  name: 'data-stream-name',
  color: '',
  resolution: 0,
  dataType: DataType.NUMBER,
  unit: '',
  data: [],
};

const alarmValue = {
  low: {
    value: 'Critical',
    icon: StatusIcon.ERROR,
  },
  middle: {
    value: 'Warning',
    icon: StatusIcon.LATCHED,
  },
  high: {
    value: 'Normal',
    icon: StatusIcon.NORMAL,
  },
};

const annotations = {
  y: [
    {
      color: '#3F7E23',
      value: 3300,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: alarmValue.high.value,
        show: true,
      },
      icon: alarmValue.high.icon,
    },
    {
      color: '#F29D38',
      value: 4000,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: alarmValue.middle.value,
        show: true,
      },
      icon: alarmValue.middle.icon,
    },
    {
      color: '#C03F25',
      value: 4000,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: alarmValue.low.value,
        show: true,
      },
      icon: alarmValue.low.icon,
    },
  ],
};

it('renders latest value', () => {
  const LATEST_VALUE1 = 100;
  const LATEST_VALUE2 = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      data: [
        { x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE1 },
        { x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE2 },
      ],
    },
    ...VIEWPORT,
  });
  cy.wait(1000);
  cy.get('.sc-gaugebase-container')
    .invoke('text')
    .should('contain', `${LATEST_VALUE2}`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders value under percentile when detailedName is existed', () => {
  const LATEST_VALUE1 = 100;
  const LATEST_VALUE2 = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      data: [
        { x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE1 },
        { x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE2 },
      ],
      detailedName: 'Medium',
    },
    ...VIEWPORT,
  });
  cy.wait(1000);
  cy.get('.sc-gaugebase-container')
    .invoke('text')
    .should('contain', `${LATEST_VALUE2}`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders value under percentile when significantDigits is 2', () => {
  const significantDigits = 2;
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    significantDigits,
    dataStream: {
      ...DATASTREAM,
      data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    ...VIEWPORT,
  });
  cy.wait(1000);
  cy.get('.sc-gaugebase-container')
    .invoke('text')
    .should('contain', `${LATEST_VALUE}`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when value is string', () => {
  const LATEST_VALUE = 'ABC';
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.STRING,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', NO_VALUE_PRESENT).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Invalid value');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` and `yMax` omitted from the viewport and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', 100).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMin & yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` omitted from the viewport and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    yMax: 5000,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', 0).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMin');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMax` omitted from the viewport and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    yMin: 0,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', 0).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` and `yMax` are the same and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    yMin: 100,
    yMax: 100,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', 0).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Invalid yMin & yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders normal when value is greater than `yMax` and unit is not exist.', () => {
  const LATEST_VALUE = 6000;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', LATEST_VALUE).should('be.visible');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when value is less than `yMin` and unit is not exist.', () => {
  const LATEST_VALUE = -100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_ERROR).should('not.exist');
  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` and `yMax` omitted from the viewport and unit is exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', LATEST_VALUE).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMin & yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders normal when value is greater than `yMax` and unit is exist.', () => {
  const LATEST_VALUE = 5500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', LATEST_VALUE).should('be.visible');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when value is less than `yMin` and unit is exist.', () => {
  const LATEST_VALUE = -100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-gaugebase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_ERROR).should('not.exist');
  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders loading status', () => {
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      isLoading: true,
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get('.sc-gaugebase-container')
    .invoke('text')
    .should('contain', 'Loading');

  cy.get(VALUE_LOADING).should('be.visible');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders unit value', () => {
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get('.sc-gaugebase-container')
    .invoke('text')
    .should('contain', `${LATEST_VALUE.toString()}rpm`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error value', () => {
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      error: errorMessage,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', errorMessage);

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders alarm Critical', () => {
  const LATEST_VALUE = 4600;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      id: 'car-speed-alarm',
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    associatedStreams: [
      {
        id: 'car-speed-alarm',
        type: StreamType.ALARM,
      },
    ],
    annotations,
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get(VALUE_SVG)
    .should('be.visible')
    .should('contain', 'Critical');

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders alarm Warning', () => {
  const LATEST_VALUE = 3800;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      id: 'car-speed-alarm',
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    associatedStreams: [
      {
        id: 'car-speed-alarm',
        type: StreamType.ALARM,
      },
    ],
    annotations,
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get(VALUE_SVG)
    .should('be.visible')
    .should('contain', 'Warning');

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders alarm Normal', () => {
  const LATEST_VALUE = 2000;
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    size: GAUGLE_SIZE,
    dataStream: {
      ...DATASTREAM,
      id: 'car-speed-alarm',
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    associatedStreams: [
      {
        id: 'car-speed-alarm',
        type: StreamType.ALARM,
      },
    ],
    annotations,
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get(VALUE_SVG)
    .should('be.visible')
    .should('contain', 'Normal');

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders empty value', () => {
  visitDynamicWidget(cy, {
    componentTag: 'sc-gauge',
    dataStream: DATASTREAM,
    size: GAUGLE_SIZE,
    ...VIEWPORT,
  });

  cy.contains('.sc-gaugebase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});
