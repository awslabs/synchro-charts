import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { ScGridTooltip } from '../../sc-widget-grid/sc-grid-tooltip';
import { ScDialBase } from './sc-dial-base';
import { update } from '../../charts/common/tests/merge';
import { DEFAULT_CHART_CONFIG } from '../../charts/sc-webgl-base-chart/chartDefaults';
import { MINUTE_IN_MS } from '../../../utils/time';
import { DATA_STREAM, NUMBER_INFO_1, NUMBER_STREAM_1 } from '../../../testing/__mocks__/mockWidgetProperties';
import { round } from '../../../utils/number';
import { DataType } from '../../../utils/dataConstants';
import { COMPARISON_OPERATOR, StatusIcon } from '../../charts/common/constants';
import { ColorConfigurations } from '../util';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
  yMin: 0,
  yMax: 5000,
};

const VALUE1 = 1250;
const VALUE2 = 3250;
const VALUE3 = 4500;

const newValueSpecPage = async (propOverrides: Partial<Components.ScDialBase> = {}) => {
  const page = await newSpecPage({
    components: [ScDialBase, ScGridTooltip],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dialBase = page.doc.createElement('sc-dial-base') as CustomHTMLElement<Components.ScDialBase>;
  const props: Partial<Components.ScDialBase> = {
    viewport: VIEWPORT,
    ...propOverrides,
  };
  update(dialBase, props);
  page.body.appendChild(dialBase);

  await page.waitForChanges();

  return { page, dialBase };
};

describe('Overview', () => {
  it('renders `-` value when has no data', async () => {
    const { dialBase } = await newValueSpecPage({
      // Setup scenario where the 'live time frame value label' renders
      propertyStream: DATA_STREAM,
    });

    expect(dialBase.innerHTML).toContain('-');
  });

  it('renders `%` unit when has no unit', async () => {
    const { dialBase } = await newValueSpecPage({
      propertyStream: NUMBER_STREAM_1,
      propertyPoint: NUMBER_STREAM_1.data[0],
    });

    const value = round((NUMBER_STREAM_1.data[0].y / (VIEWPORT.yMax - VIEWPORT.yMin)) * 100);
    expect(dialBase.textContent).toContain(`${value} %`);
  });

  it('renders defined unit when has unit', async () => {
    const { dialBase } = await newValueSpecPage({
      propertyStream: {
        id: 'car-speed-alarm',
        name: 'Wind temperature',
        data: [
          {
            x: new Date(2001, 0, 0).getTime(),
            y: VALUE1,
          },
        ],
        unit: 'rpm',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      propertyPoint: {
        x: new Date(2001, 0, 0).getTime(),
        y: VALUE1,
      },
    });

    expect(dialBase.textContent).toContain(`${VALUE1} rpm`);
  });

  it('renders latest value when has more than 1 data', async () => {
    const { dialBase } = await newValueSpecPage({
      propertyStream: {
        id: 'car-speed-alarm',
        name: 'Wind temperature',
        data: [
          {
            x: new Date(2001, 0, 0).getTime(),
            y: VALUE1,
          },
          {
            x: new Date(2002, 0, 0).getTime(),
            y: VALUE2,
          },
        ],
        unit: 'rpm',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      propertyPoint: {
        x: new Date(2001, 0, 0).getTime(),
        y: VALUE2,
      },
    });

    expect(dialBase.textContent).toContain(`${VALUE2} rpm`);
  });

  it('render percent with two significant sigits value When significantDigits = 2', async () => {
    const { dialBase } = await newValueSpecPage({
      propertyStream: {
        id: 'car-speed-alarm',
        name: 'Wind temperature',
        data: [
          {
            x: new Date(2001, 0, 0).getTime(),
            y: VALUE1,
          },
        ],
        unit: '',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      propertyPoint: {
        x: new Date(2001, 0, 0).getTime(),
        y: VALUE1,
      },
      significantDigits: 2,
    });

    const percent = VALUE1 / (VIEWPORT.yMax - VIEWPORT.yMin);
    const value = (percent * 100).toPrecision(2);
    expect(dialBase.textContent).toContain(`${value} %`);
  });

  it('Overwrite the previous copy when messageOverrides provided', async () => {
    const messageOverrides = {
      tooltip: { tooltipValueTitles: 'Current data' },
    };
    const { dialBase } = await newValueSpecPage({
      propertyStream: {
        id: 'car-speed-alarm',
        name: 'Wind temperature',
        data: [
          {
            x: new Date(2001, 0, 0).getTime(),
            y: VALUE1,
          },
        ],
        unit: '',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      propertyPoint: {
        x: new Date(2001, 0, 0).getTime(),
        y: VALUE1,
      },
      messageOverrides,
    });

    expect(dialBase.textContent).toContain(messageOverrides.tooltip.tooltipValueTitles);
  });

  it('renders loading icon when loading condition', async () => {
    const { dialBase } = await newValueSpecPage({
      isLoading: true,
      propertyStream: { ...NUMBER_STREAM_1, data: [] },
      propertyPoint: undefined,
    });

    const value = round((NUMBER_STREAM_1.data[0].y / (VIEWPORT.yMax - VIEWPORT.yMin)) * 100);
    expect(dialBase.textContent).not.toContain(`${value} %`);
    expect(dialBase.textContent).toContain('Loading');
    expect(dialBase.innerHTML).toContain('data-testid="loading"');
  });
});

describe('Alarm states', () => {
  it('renders `Critical` text with related colors and icon when Critical', async () => {
    const { dialBase } = await newValueSpecPage({
      propertyStream: NUMBER_STREAM_1,
      propertyPoint: NUMBER_STREAM_1.data[0],
      alarmStream: NUMBER_STREAM_1,
      breachedThreshold: {
        color: ColorConfigurations.CRITICAL,
        value: 1650,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        dataStreamIds: [NUMBER_INFO_1.id],
        label: {
          text: 'Critical',
          show: true,
        },
        icon: StatusIcon.ERROR,
      },
    });

    expect(dialBase.textContent).toContain('Critical');
    expect(dialBase.innerHTML).toContain(ColorConfigurations.CRITICAL);
  });
  it('renders `Warning` text with related colors and icon when Warning', async () => {
    const DATASTREAM = {
      id: 'car-speed-alarm',
      name: 'Wind temperature',
      data: [
        {
          x: new Date(2001, 0, 0).getTime(),
          y: VALUE2,
        },
      ],
      unit: '',
      resolution: 0,
      dataType: DataType.NUMBER,
    };
    const { dialBase } = await newValueSpecPage({
      propertyStream: DATASTREAM,
      propertyPoint: DATASTREAM.data[0],
      alarmStream: DATASTREAM,
      breachedThreshold: {
        color: ColorConfigurations.WARNING,
        value: 3300,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        dataStreamIds: [NUMBER_INFO_1.id],
        label: {
          text: 'Warning',
          show: true,
        },
        icon: StatusIcon.LATCHED,
      },
    });

    expect(dialBase.textContent).toContain('Warning');
    expect(dialBase.innerHTML).toContain(ColorConfigurations.WARNING);
  });
  it('renders `Normal` text with related colors and icon when Normal', async () => {
    const DATASTREAM = {
      id: 'car-speed-alarm',
      name: 'Wind temperature',
      data: [
        {
          x: new Date(2001, 0, 0).getTime(),
          y: VALUE3,
        },
      ],
      unit: '',
      resolution: 0,
      dataType: DataType.NUMBER,
    };
    const { dialBase } = await newValueSpecPage({
      propertyStream: DATASTREAM,
      propertyPoint: DATASTREAM.data[0],
      alarmStream: DATASTREAM,
      breachedThreshold: {
        color: ColorConfigurations.NORMAL,
        value: 3300,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        dataStreamIds: [NUMBER_INFO_1.id],
        label: {
          text: 'Normal',
          show: true,
        },
        icon: StatusIcon.NORMAL,
      },
    });

    expect(dialBase.textContent).toContain('Normal');
    expect(dialBase.innerHTML).toContain(ColorConfigurations.NORMAL);
  });
});
