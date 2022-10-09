import { COMPARISON_OPERATOR, DataType, NO_VALUE_PRESENT, StatusIcon, StreamType } from '../../../src/constants';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import { Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';
import { round } from '../../../src/utils/number';

const VALUE_ERROR = '[data-testid="warning"]';
const VALUE_LOADING = '[data-testid="loading"]';
const VALUE_SVG = '[data-testid="current-value"]';
const errorMessage = 'SiteWise network error';

const VIEWPORT = { duration: undefined, yMin: Y_MIN, yMax: Y_MAX };

const DIAL_SIZE = {
  fontSize: 65,
  dialThickness: 30,
  iconSize: 45,
  labelSize: 25,
  unitSize: 30,
};

const DATASTREAM = {
  id: 'test-dial-id',
  name: 'data-stream-name',
  color: 'black',
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
      color: '#C03F25',
      value: 1650,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: alarmValue.low.value,
        show: true,
      },
      icon: alarmValue.low.icon,
    },
    {
      color: '#F29D38',
      value: 3300,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: alarmValue.middle.value,
        show: true,
      },
      icon: alarmValue.middle.icon,
    },
    {
      color: '#3F7E23',
      value: 3300,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: alarmValue.high.value,
        show: true,
      },
      icon: alarmValue.high.icon,
    },
  ],
};

it('renders latest value', () => {
  const LATEST_VALUE1 = 100;
  const LATEST_VALUE2 = 2238;
  const DATA = round((LATEST_VALUE2 / (Y_MAX - Y_MIN)) * 100);
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
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
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', `${DATA}%`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders value when detailedName is existed', () => {
  const LATEST_VALUE1 = 100;
  const LATEST_VALUE2 = 2238;
  const DATA = round((LATEST_VALUE2 / (Y_MAX - Y_MIN)) * 100);
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
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
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', `${DATA}%`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders value with 2 digits when significantDigits is 2 and unit is not exist.', () => {
  const significantDigits = 2;
  const LATEST_VALUE = 2238;
  const DATA = ((LATEST_VALUE / (Y_MAX - Y_MIN)) * 100).toPrecision(significantDigits);
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    significantDigits,
    dataStream: {
      ...DATASTREAM,
      data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    ...VIEWPORT,
  });
  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', `${DATA}%`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders value with 4 digits when significantDigits is 4 and unit is exist.', () => {
  const significantDigits = 4;
  const LATEST_VALUE = 700.825;
  const value = LATEST_VALUE.toPrecision(significantDigits);
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: { ...DIAL_SIZE, fontSize: 55, unitSize: 25 },
    significantDigits,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    ...VIEWPORT,
  });
  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', `${value}rpm`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when value is string', () => {
  const LATEST_VALUE = 'ABC';
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.STRING,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', NO_VALUE_PRESENT).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Invalid value');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` and `yMax` omitted from the viewport and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', 100).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMin & yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` omitted from the viewport and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    yMax: 5000,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', 0).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMin');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMax` omitted from the viewport and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    yMin: 0,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', 0).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` and `yMax` are the same and unit is not exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
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
  cy.contains('.sc-dialbase-container', 0).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Invalid yMin & yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders normal when value is greater than `yMax` and unit is not exist.', () => {
  const LATEST_VALUE = 8000;
  const DATA = round((LATEST_VALUE / (Y_MAX - Y_MIN)) * 100);
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', DATA).should('be.visible');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when value is less than `yMin` and unit is not exist.', () => {
  const LATEST_VALUE = -100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_ERROR).should('not.exist');
  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when `yMin` and `yMax` omitted from the viewport and unit is exist.', () => {
  const LATEST_VALUE = 100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', LATEST_VALUE).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Missing yMin & yMax');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders normal when value is greater than `yMax` and unit is exist.', () => {
  const LATEST_VALUE = 5500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', LATEST_VALUE).should('be.visible');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error message when value is less than `yMin` and unit is exist.', () => {
  const LATEST_VALUE = -100;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.NUMBER,
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_ERROR).should('not.exist');
  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders loading status', () => {
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      isLoading: true,
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', 'Loading');

  cy.get(VALUE_LOADING).should('be.visible');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders unit value', () => {
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', `${LATEST_VALUE.toString()}rpm`);

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error value', () => {
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
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

it('renders alarm Critica', () => {
  const LATEST_VALUE = 1250;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
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
  const LATEST_VALUE = 3250;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
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
  const LATEST_VALUE = 4500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE,
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
    componentTag: 'sc-dial',
    dataStream: DATASTREAM,
    size: DIAL_SIZE,
    ...VIEWPORT,
  });

  cy.contains('.sc-dialbase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});
