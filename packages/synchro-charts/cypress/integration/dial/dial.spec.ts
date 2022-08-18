import { COMPARISON_OPERATOR, DataType, NO_VALUE_PRESENT, StatusIcon, StreamType } from '../../../src/constants';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import { Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';
import { round } from '../../../src/utils/number';

const VALUE_ERROR = '[data-testid="warning"]';
const VALUE_LOADING = '[data-testid="loading"]';
const VALUE_SVG = '[data-testid="current-value"]';
const errorMessage = 'SiteWise network error';

const VIEWPORT = { duration: undefined, yMin: Y_MIN, yMax: Y_MAX };

export const FONT_SIZE = {
  xxSmall: 14,
  xSmall: 16,
  smaller: 20,
  small: 24,
  medium: 32,
  large: 48,
  larger: 60,
  xLarger: 96,
};

const LINE_THICKNESS = {
  xSmall: 8,
  small: 10,
  medium: 15,
  large: 30,
  larger: 36,
  xLarger: 50,
};

const BOX = {
  xSmall: 75,
  small: 100,
  medium: 150,
  large: 200,
  larger: 300,
  xLarger: 500,
};

const DIAL_SIZE_CONFIG = {
  XXL: {
    fontSize: FONT_SIZE.xLarger,
    dialThickness: LINE_THICKNESS.xLarger,
    iconSize: FONT_SIZE.xLarger,
    labelSize: FONT_SIZE.large,
    unitSize: FONT_SIZE.large,
    width: BOX.xLarger,
  },
  XL: {
    fontSize: FONT_SIZE.larger,
    dialThickness: LINE_THICKNESS.larger,
    iconSize: FONT_SIZE.large,
    labelSize: FONT_SIZE.medium,
    unitSize: FONT_SIZE.medium,
    width: BOX.larger,
  },
  L: {
    fontSize: FONT_SIZE.large,
    dialThickness: LINE_THICKNESS.large,
    iconSize: FONT_SIZE.large,
    labelSize: FONT_SIZE.small,
    unitSize: FONT_SIZE.small,
    width: BOX.large,
  },
  M: {
    fontSize: FONT_SIZE.medium,
    dialThickness: LINE_THICKNESS.medium,
    iconSize: FONT_SIZE.medium,
    labelSize: FONT_SIZE.smaller,
    unitSize: FONT_SIZE.smaller,
    width: BOX.medium,
  },
  S: {
    fontSize: FONT_SIZE.small,
    dialThickness: LINE_THICKNESS.small,
    iconSize: FONT_SIZE.smaller,
    labelSize: FONT_SIZE.xSmall,
    unitSize: FONT_SIZE.xSmall,
    width: BOX.small,
  },
  XS: {
    fontSize: FONT_SIZE.smaller,
    dialThickness: LINE_THICKNESS.xSmall,
    iconSize: FONT_SIZE.xSmall,
    labelSize: FONT_SIZE.xxSmall,
    unitSize: FONT_SIZE.xxSmall,
    width: BOX.xSmall,
  },
};

const DATASTREAM = {
  id: 'test-dial-id',
  detailedName: 'data-stream-name/detailed-name',
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
    size: DIAL_SIZE_CONFIG.L,
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

it('renders string value', () => {
  const LATEST_VALUE = 'ABC';
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.L,
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

it('renders loading status', () => {
  const LATEST_VALUE = 2238;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.L,
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
    size: DIAL_SIZE_CONFIG.L,
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
    size: DIAL_SIZE_CONFIG.L,
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
    size: DIAL_SIZE_CONFIG.L,
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
    size: DIAL_SIZE_CONFIG.L,
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

it('renders alarm Normal when size = `XS`', () => {
  const LATEST_VALUE = 4500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.XS,
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

it('renders alarm Normal when size = `S`', () => {
  const LATEST_VALUE = 4500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.S,
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

it('renders alarm Normal when size = `M`', () => {
  const LATEST_VALUE = 4500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.M,
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

it('renders alarm Normal when size = `L`', () => {
  const LATEST_VALUE = 4500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.L,
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

it('renders alarm Normal when size = `XL`', () => {
  const LATEST_VALUE = 4500;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.XL,
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

it('renders alarm Normal when size = `XXL`', () => {
  const LATEST_VALUE = 4444;
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    size: DIAL_SIZE_CONFIG.XXL,
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
    size: DIAL_SIZE_CONFIG.L,
    ...VIEWPORT,
  });

  cy.contains('.sc-dialbase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});
