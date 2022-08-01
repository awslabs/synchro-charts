import { VIEWPORT } from '../../../src/components/charts/common/testUtil';
import {
  DEFAULT_THRESHOLD_OPTIONS,
  DEFAULT_THRESHOLD_OPTIONS_OFF,
} from '../../../src/components/charts/sc-webgl-base-chart/chartDefaults';
import { COMPARISON_OPERATOR, DataType, NO_VALUE_PRESENT, StatusIcon, StreamType } from '../../../src/constants';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import { X_MIN, Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';
import {
  ALARM_STREAM,
  ALARM_STREAM_INFO,
  ALARM_THRESHOLD,
  DATA_STREAM,
  DATA_WITH_ALARM_ASSOCIATION,
  DATA_WITH_ALARM_INFO,
} from '../../../src/testing/__mocks__/mockWidgetProperties';
import { DataStream, Primitive } from '../../../src/utils/dataTypes';
import { round } from '../../../src/utils/number';
import { MINUTE_IN_MS } from '../../../src/utils/time';

const root = '/tests/sc-dial';
const VALUE_ERROR = '[data-testid="warning"]';
const VALUE_LOADING = '[data-testid="loading"]';
const VALUE_SVG = '[data-testid="current-value"]';
const errorMessage = 'SiteWise network error';

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

// const getRoute = ({
//   latestValue,
//   isLoading,
//   unit,
//   error = '',
//   alarm,
// }: {
//   latestValue?: Primitive;
//   isLoading?: boolean;
//   unit?: string;
//   error?: string;
//   alarm?: string;
// }): string =>
//   `${root}?latestValue=${latestValue}&&isloading=${isLoading}&&unit=${unit}&&error=${error}&&alarm=${alarm}`;
// const WIDTH = 300;
// const HEIGHT = 400;
// beforeEach(() => {
//   cy.viewport(WIDTH, HEIGHT);
// });

it('renders latest value', () => {
  const LATEST_VALUE1 = 100;
  const LATEST_VALUE2 = 2238;
  const DATA = round((LATEST_VALUE2 / (Y_MAX - Y_MIN)) * 100);
  visitDynamicWidget(cy, {
    componentTag: 'sc-dial',
    dataStream: {
      ...DATASTREAM,
      data: [
        { x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE1 },
        { x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE2 },
      ],
    },
    duration: undefined,
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
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      dataType: DataType.STRING,
    },
    duration: undefined,
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
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      isLoading: true,
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    duration: undefined,
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
    dataStream: {
      ...DATASTREAM,
      unit: 'rpm',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
    },
    duration: undefined,
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
    dataStream: {
      ...DATASTREAM,
      unit: '',
      data: [{ x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE }],
      error: errorMessage,
    },
    duration: undefined,
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
    annotations: {
      y: [
        {
          color: '#000',
          value: alarmValue.low.value,
          comparisonOperator: COMPARISON_OPERATOR.EQUAL,
          dataStreamIds: ['car-speed-alarm'],
          icon: alarmValue.low.icon,
        },
      ],
      thresholdOptions: DEFAULT_THRESHOLD_OPTIONS,
    },
    duration: undefined,
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
    annotations: {
      y: [
        {
          color: '#000',
          value: alarmValue.middle.value,
          comparisonOperator: COMPARISON_OPERATOR.EQUAL,
          dataStreamIds: ['car-speed-alarm'],
          icon: alarmValue.middle.icon,
        },
      ],
      thresholdOptions: DEFAULT_THRESHOLD_OPTIONS_OFF,
    },
    duration: undefined,
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
    annotations: {
      y: [
        {
          color: '#000',
          value: alarmValue.high.value,
          comparisonOperator: COMPARISON_OPERATOR.EQUAL,
          dataStreamIds: ['car-speed-alarm'],
          icon: alarmValue.high.icon,
        },
      ],
      thresholdOptions: DEFAULT_THRESHOLD_OPTIONS_OFF,
    },
    duration: undefined,
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
    duration: undefined,
  });

  cy.contains('.sc-dialbase-container', NO_VALUE_PRESENT).should('be.visible');

  cy.get(VALUE_LOADING).should('not.exist');
  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});
