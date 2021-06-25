import { newSpecPage } from '@stencil/core/testing';
import { update } from '../../common/tests/merge';

import { TREND_ICON_DASH_ARRAY } from '../../../../utils/dataTypes';
import { CustomHTMLElement } from '../../../../utils/types';
import { MonitorLegendRow } from './monitor-legend-row';
import { POINT_TYPE } from '../../monitor-webgl-base-chart/activePoints';
import { DATA_STREAM_INFO } from '../../../../testing/__mocks__/mockWidgetProperties';
import { Components } from '../../../../components.d';
import { StatusIcon } from '../../common/constants';

const noop = () => {};

const CURRENT_VALUE_SELECTOR = "[data-testid='current-value']";
const COLOR_BAR_SELECTOR = '.bar';

const newLegendRowSpecPage = async (props: Partial<Components.MonitorLegendRow>) => {
  const page = await newSpecPage({
    components: [MonitorLegendRow],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const legendRow = page.doc.createElement('monitor-legend-row') as CustomHTMLElement<Components.MonitorLegendRow>;
  const defaultProps: Components.MonitorLegendRow = {
    isLoading: false,
    updateDataStreamName: noop,
    isEditing: false,
    streamId: DATA_STREAM_INFO.id,
    label: DATA_STREAM_INFO.name,
    color: DATA_STREAM_INFO.color as string,
    showDataStreamColor: true,
  };
  update(legendRow, { ...defaultProps, ...props });
  page.body.appendChild(legendRow);
  await page.waitForChanges();
  return { page, dataStreamInfo: legendRow };
};

it('displays bar as the color given by the data stream info', async () => {
  const COLOR = 'red';
  const { dataStreamInfo } = await newLegendRowSpecPage({
    color: COLOR,
    showDataStreamColor: true,
  });

  const colorBar = dataStreamInfo.querySelector(COLOR_BAR_SELECTOR) as SVGElement;
  expect(colorBar).not.toBeNull();
  expect(colorBar.innerHTML).toInclude(COLOR);
});

it('does not display bar when showDataStreamColor is false', async () => {
  const { dataStreamInfo } = await newLegendRowSpecPage({
    showDataStreamColor: false,
  });

  expect(dataStreamInfo.querySelector(COLOR_BAR_SELECTOR)).toBeNull();
});

it('displays icon when passed in', async () => {
  const { dataStreamInfo } = await newLegendRowSpecPage({
    icon: StatusIcon.NORMAL,
  });

  expect(dataStreamInfo.innerHTML).toInclude('monitor-chart-icon');
});

it('displays unit when provided', async () => {
  const UNIT = 'my-unit';
  const { dataStreamInfo } = await newLegendRowSpecPage({
    unit: UNIT,
  });
  expect(dataStreamInfo.innerHTML).toInclude(UNIT);
});

it('displays active points y value when provided', async () => {
  const ACTIVE_POINT = {
    x: Date.now(),
    y: 100,
  };
  const { dataStreamInfo } = await newLegendRowSpecPage({
    point: ACTIVE_POINT,
  });
  expect(dataStreamInfo.innerHTML).toInclude(ACTIVE_POINT.y.toString());
});

it('displays active points y value when provided, with extraneous precision truncated', async () => {
  const ACTIVE_POINT = {
    x: Date.now(),
    y: 100.0000001,
  };
  const { dataStreamInfo } = await newLegendRowSpecPage({
    point: ACTIVE_POINT,
  });
  expect(dataStreamInfo.innerHTML).not.toInclude(ACTIVE_POINT.y.toString());
  expect(dataStreamInfo.innerHTML).toInclude('100');
});

describe('loading status', () => {
  it('has loading spinner present when it is loading', async () => {
    const { dataStreamInfo } = await newLegendRowSpecPage({
      isLoading: true,
    });
    const loadingSpinners = dataStreamInfo.querySelector('sc-loading-spinner');
    expect(loadingSpinners).not.toBeNull();
  });

  it('does not have loading spinner present when it is not loading', async () => {
    const { dataStreamInfo } = await newLegendRowSpecPage({
      isLoading: false,
    });
    const loadingSpinners = dataStreamInfo.querySelector('sc-loading-spinner');
    expect(loadingSpinners).toBeNull();
  });
});

describe('correctly renders the value color', () => {
  it('has default value color when none specified', async () => {
    const { dataStreamInfo } = await newLegendRowSpecPage({});

    const value = dataStreamInfo.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;

    expect(value.style.color).toBe('#000');
  });

  it('has specified value color', async () => {
    const valueColor = 'red';
    const { dataStreamInfo } = await newLegendRowSpecPage({ valueColor });

    const value = dataStreamInfo.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;

    expect(value.style.color).toBe(valueColor);
  });
});

describe('correctly renders data stream icon', () => {
  it('displays data stream values with solid icon', async () => {
    const ACTIVE_POINT = {
      x: Date.now(),
      y: 100,
    };

    const { dataStreamInfo } = await newLegendRowSpecPage({
      point: ACTIVE_POINT,
      pointType: POINT_TYPE.DATA,
    });

    const icon = dataStreamInfo.querySelector('.bar') as SVGElement;
    expect(icon.innerHTML).not.toInclude(TREND_ICON_DASH_ARRAY);
  });

  it('displays trend line values with dashed icon', async () => {
    const ACTIVE_POINT = {
      x: Date.now(),
      y: 100,
    };

    const { dataStreamInfo } = await newLegendRowSpecPage({
      point: ACTIVE_POINT,
      pointType: POINT_TYPE.TREND,
    });

    const icon = dataStreamInfo.querySelector('.bar') as SVGElement;
    expect(icon.innerHTML).toInclude(TREND_ICON_DASH_ARRAY);
  });
});
