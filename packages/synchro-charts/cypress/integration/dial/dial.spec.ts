import { COMPARISON_OPERATOR, DataType, NO_VALUE_PRESENT, StatusIcon, StreamType } from '../../../src/constants';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import { Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';
import { round } from '../../../src/utils/number';

const VALUE_ERROR = '[data-testid="warning"]';
const VALUE_LOADING = '[data-testid="loading"]';
const VALUE_SVG = '[data-testid="current-value"]';
const errorMessage = 'SiteWise network error';

const VIEWPORT = { duration: undefined, yMin: Y_MIN, yMax: Y_MAX };

const DialMessageOverrides = {
  dataNotNumberError: 'Only accept numbers',
  tooltipValueTitles: 'Current data',
  tooltipValueTimeDescribed: 'at',
  tooltipStatusTitles: 'Current Status',
  tooltipStatusDescribed: 'to',
};

const DIAL_SIZE = {
  fontSize: 70,
  dialThickness: 30,
  iconSize: 50,
  labelSize: 30,
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
  offsetX: 55,
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

it('renders value under percentile when detailedName is existed', () => {
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

it('renders value under percentile when significantDigits is 2', () => {
  const significantDigits = 2;
  const LATEST_VALUE = 2238;
  const DATA = Number((LATEST_VALUE / (Y_MAX - Y_MIN)).toPrecision(significantDigits)) * 100;
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

it('renders string value', () => {
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
    .should('contain', 'Only numbers are supported');

  cy.get(VALUE_LOADING).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders `Only accept numbers` when value is string', () => {
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
    messageOverrides: DialMessageOverrides,
    ...VIEWPORT,
  });

  cy.wait(1000);
  cy.contains('.sc-dialbase-container', NO_VALUE_PRESENT).should('be.visible');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Only accept numbers');

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
    .should('contain', 'Critical')
    .get('circle');

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
