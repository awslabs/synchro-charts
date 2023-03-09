import { newSpecPage } from '@stencil/core/testing';
import { CustomHTMLElement } from '../../../utils/types';
import { Components } from '../../../components';
import { update } from '../common/tests/merge';
import { ScTooltipRow } from './sc-tooltip-row';
import { DataPoint, DataStreamInfo, TREND_ICON_DASH_ARRAY } from '../../../utils/dataTypes';
import { POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { DEFAULT_TOOLTIP_VALUE_COLOR } from './constants';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { DataType } from '../../../utils/dataConstants';
import { StatusIcon } from '../common/constants';

const CURR_VALUE_SELECTOR = "[data-testid='current-value']";
const LABEL_SELECTOR = "[data-testid='tooltip-row-label']";

const DATA_STREAM_INFO: DataStreamInfo = {
  color: 'black',
  resolution: 0,
  name: 'data-stream-name',
  id: 'data-stream-id',
  dataType: DataType.NUMBER,
};

const DEFAULT_POINT: DataPoint = {
  x: Date.now(),
  y: 100,
};

const newTooltipRowPage = async (propOverrides: Partial<Components.IotAppKitVisTooltipRow> = {}) => {
  const page = await newSpecPage({
    components: [ScTooltipRow],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const tooltipRow = page.doc.createElement('iot-app-kit-vis-tooltip-row') as CustomHTMLElement<
    Components.IotAppKitVisTooltipRow
  >;
  const props: Components.IotAppKitVisTooltipRow = {
    label: DATA_STREAM_INFO.name,
    color: DATA_STREAM_INFO.color as string,
    point: DEFAULT_POINT,
    pointType: POINT_TYPE.DATA,
    resolution: undefined,
    showDataStreamColor: true,
    ...propOverrides,
  };
  update(tooltipRow, props);
  page.body.appendChild(tooltipRow);
  await page.waitForChanges();

  return { page, tooltipRow };
};

describe('valueColor property', () => {
  it('renders the values font color to be that of the value color when provided', async () => {
    const VALUE_COLOR = 'purple';
    const { tooltipRow } = await newTooltipRowPage({ valueColor: VALUE_COLOR });
    const value = tooltipRow.querySelector(CURR_VALUE_SELECTOR) as HTMLElement;

    expect(value.style.color).toBe(VALUE_COLOR);
  });

  it('renders the values font color to be the default color when none provided', async () => {
    const { tooltipRow } = await newTooltipRowPage({});
    const value = tooltipRow.querySelector(CURR_VALUE_SELECTOR) as HTMLElement;

    expect(value.style.color).toBe(DEFAULT_TOOLTIP_VALUE_COLOR);
  });
});

describe('icon property', () => {
  it('renders the icon to be that of the value provided', async () => {
    const { tooltipRow } = await newTooltipRowPage({ icon: StatusIcon.SNOOZED });
    const value = tooltipRow.querySelector('iot-app-kit-vis-chart-icon') as any;
    expect(value).not.toBeNull();
  });
  it('renders the icon to be empty when no value provided', async () => {
    const { tooltipRow } = await newTooltipRowPage({});
    const value = tooltipRow.querySelector('iot-app-kit-vis-chart-icon') as HTMLElement;
    expect(value).toBeNull();
  });
});

describe('correctly renders data stream icon', () => {
  it('displays data stream values with solid icon', async () => {
    const { tooltipRow } = await newTooltipRowPage({
      pointType: POINT_TYPE.DATA,
    });

    const icon = tooltipRow.querySelector('.bar') as SVGElement;
    expect(icon.innerHTML).not.toInclude(TREND_ICON_DASH_ARRAY);
  });

  it('displays trend line values with dashed icon', async () => {
    const { tooltipRow } = await newTooltipRowPage({
      pointType: POINT_TYPE.TREND,
    });

    const icon = tooltipRow.querySelector('.bar') as SVGElement;
    expect(icon.innerHTML).toInclude(TREND_ICON_DASH_ARRAY);
  });
});

it('displays provided label', async () => {
  const NEW_NAME = 'new name!';
  const { tooltipRow } = await newTooltipRowPage({
    label: NEW_NAME,
  });

  const label = tooltipRow.querySelector(LABEL_SELECTOR) as HTMLElement;
  expect(label.innerText).toEqual(NEW_NAME);
});

it('displays value placeholder when no point present', async () => {
  const { tooltipRow } = await newTooltipRowPage({ point: undefined });

  const value = tooltipRow.querySelector(CURR_VALUE_SELECTOR) as HTMLElement;
  expect(value.innerText).toContain(NO_VALUE_PRESENT);
});

describe('showDataStreamColor option', () => {
  const BAR_SELECTOR = '.bar';

  it('renders color bar when showDataStreamColor is true', async () => {
    const { tooltipRow } = await newTooltipRowPage({
      showDataStreamColor: true,
    });

    expect(tooltipRow.querySelectorAll(BAR_SELECTOR)).not.toBeEmpty();
  });

  it('does not render color bar when showDataStreamColor is false', async () => {
    const { tooltipRow } = await newTooltipRowPage({
      showDataStreamColor: false,
    });

    expect(tooltipRow.querySelectorAll(BAR_SELECTOR)).toBeEmpty();
  });
});

describe('string data', () => {
  it('renders string value correctly', async () => {
    const STRING_TOOLTIP_VALUE = 'STRING_TOOLTIP_VALUE';

    const { tooltipRow } = await newTooltipRowPage({
      point: {
        x: Date.now(),
        y: STRING_TOOLTIP_VALUE,
      },
    });

    const value = tooltipRow.querySelector(CURR_VALUE_SELECTOR) as HTMLElement;
    expect(value.textContent).toBe(STRING_TOOLTIP_VALUE);
  });
});
