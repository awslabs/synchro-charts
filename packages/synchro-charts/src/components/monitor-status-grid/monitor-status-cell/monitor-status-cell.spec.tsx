import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components.d';
import { MonitorGrid } from '../../monitor-grid/monitor-grid';
import { DataPoint, DEFAULT_MESSAGE_OVERRIDES } from '../../../utils/dataTypes';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../../charts/common/tests/merge';
import { MonitorStatusCell } from './monitor-status-cell';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { MonitorDataStreamName } from '../../monitor-data-stream-name/monitor-data-stream-name';
import { ALARM_STREAM, DATA_STREAM } from '../../../testing/__mocks__/mockWidgetProperties';
import { StatusIcon } from '../../charts/common/constants';

const STRING_POINT: DataPoint<string> = {
  x: Date.now(),
  y: 'ALARM',
};

const NUMBER_POINT: DataPoint<number> = {
  x: Date.now(),
  y: 123,
};

const cellSpecPage = async (propOverrides: Partial<Components.MonitorStatusCell> = {}) => {
  const page = await newSpecPage({
    components: [MonitorGrid, MonitorStatusCell, MonitorDataStreamName],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const statusCell = page.doc.createElement('monitor-status-cell') as CustomHTMLElement<Components.MonitorStatusCell>;
  const props: Components.MonitorStatusCell = {
    isEnabled: true,
    isEditing: false,
    valueColor: undefined,
    messageOverrides: {},
    propertyStream: DATA_STREAM,
    labelsConfig: {
      showValue: true,
      showName: true,
      showUnit: true,
    },
    onChangeLabel: jest.fn(),
    ...propOverrides,
  };

  update(statusCell, props);
  page.body.appendChild(statusCell);

  await page.waitForChanges();

  return { page, statusCell, props };
};

describe('title', () => {
  it('renders title as data stream name', async () => {
    const { statusCell } = await cellSpecPage({ alarmStream: DATA_STREAM });
    expect(statusCell.textContent).toContain(DATA_STREAM.name);
  });

  it('renders title as property stream when no alarm present', async () => {
    const { statusCell } = await cellSpecPage({ alarmStream: undefined, propertyStream: DATA_STREAM });
    expect(statusCell.textContent).toContain(DATA_STREAM.name);
  });

  it('renders title as alarm stream when both alarm and property are present', async () => {
    const { statusCell } = await cellSpecPage({ propertyStream: DATA_STREAM, alarmStream: ALARM_STREAM });
    expect(statusCell.textContent).toContain(ALARM_STREAM.name);
    expect(statusCell.textContent).not.toContain(DATA_STREAM.name);
  });

  it('renders no title when showName is false', async () => {
    const { statusCell } = await cellSpecPage({
      alarmStream: DATA_STREAM,
      labelsConfig: { showName: false, showUnit: true, showValue: true },
    });
    expect(statusCell.textContent).not.toContain(DATA_STREAM.name);
  });
});

it('when not enabled, renders as a gray', async () => {
  const { statusCell } = await cellSpecPage({ isEnabled: false });
  const container = statusCell.querySelector('.status-cell') as HTMLDivElement;

  expect(container.style.backgroundColor).toBe('#f1f1f1');
});

it('renders with empty placeholder when there is no data', async () => {
  const { statusCell } = await cellSpecPage({
    alarmPoint: undefined,
    alarmStream: ALARM_STREAM,
    propertyStream: undefined,
    propertyPoint: undefined,
  });

  expect(statusCell.innerHTML).toContain(NO_VALUE_PRESENT);
});

it('renders number value with truncated precision', async () => {
  const DECIMAL = 123.345;
  const { statusCell } = await cellSpecPage({
    alarmPoint: {
      x: Date.now(),
      y: DECIMAL,
    },
  });

  expect(statusCell.innerHTML).toContain(Math.round(DECIMAL));
});

it('renders string value', async () => {
  const { statusCell } = await cellSpecPage({
    alarmPoint: STRING_POINT,
    alarmStream: ALARM_STREAM,
  });

  expect(statusCell.innerHTML).toContain(STRING_POINT.y);
});

describe('messageOverrides', () => {
  it('when override provided, utilize it', async () => {
    const SOME_Y_VALUE = 'SOME_Y_VALUE';
    const MY_MSG_OVERRIDE = 'MY_MSG_OVERRIDE';
    const { statusCell } = await cellSpecPage({
      messageOverrides: {
        liveTimeFrameValueLabel: MY_MSG_OVERRIDE,
      },
      // Setup scenario where the 'live time frame value label' renders
      propertyPoint: {
        x: Date.now(),
        y: SOME_Y_VALUE,
      },
      alarmStream: ALARM_STREAM,
      propertyStream: DATA_STREAM,
    });

    expect(statusCell.innerHTML).not.toContain(DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel);
    expect(statusCell.innerHTML).toContain(MY_MSG_OVERRIDE);
  });
});

describe('secondaryPoint', () => {
  it('renders `propertyPoint` when both `propertyStream` and `alarmStream` are present', async () => {
    const SOME_Y_VALUE = 'SOME_Y_VALUE';
    const { statusCell } = await cellSpecPage({
      isEnabled: true,
      alarmStream: ALARM_STREAM,
      propertyPoint: {
        x: Date.now(),
        y: SOME_Y_VALUE,
      },
      propertyStream: DATA_STREAM,
    });

    expect(statusCell.innerHTML).toContain(`${DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel}: ${SOME_Y_VALUE}`);
  });

  it('does not render `propertyPoint` when not enabled', async () => {
    const SOME_Y_VALUE = 'SOME_Y_VALUE';
    const { statusCell } = await cellSpecPage({
      isEnabled: false,
      propertyPoint: {
        x: Date.now(),
        y: SOME_Y_VALUE,
      },
      propertyStream: DATA_STREAM,
    });

    expect(statusCell.innerHTML).not.toContain(DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel);
  });

  it('does not render `propertyPoint` when stream not provided', async () => {
    const SOME_Y_VALUE = 'SOME_Y_VALUE';
    const { statusCell } = await cellSpecPage({
      propertyPoint: {
        x: Date.now(),
        y: SOME_Y_VALUE,
      },
      propertyStream: undefined,
    });

    expect(statusCell.innerHTML).not.toContain(DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel);
  });
});

it('renders no value when `showValue` is false', async () => {
  const { statusCell } = await cellSpecPage({
    labelsConfig: { showValue: false, showUnit: true, showName: true },
    alarmPoint: NUMBER_POINT,
  });

  expect(statusCell.innerHTML).not.toContain(NUMBER_POINT.y);
});

it('renders with no value when it is not enabled', async () => {
  const { statusCell } = await cellSpecPage({ isEnabled: false, alarmPoint: NUMBER_POINT });

  expect(statusCell.innerHTML).not.toContain(NUMBER_POINT.y);
});

it('renders the background color to be the color of the `valueColor`', async () => {
  const valueColor = 'red';
  const { statusCell } = await cellSpecPage({ valueColor });
  const container = statusCell.querySelector('.status-cell') as HTMLDivElement;

  expect(container.style.backgroundColor).toBe(valueColor);
});

describe('icon', () => {
  it('renders icon when `icon` provided', async () => {
    const icon = StatusIcon.ERROR;
    const { statusCell } = await cellSpecPage({ icon });

    const chartIcon = statusCell.querySelector('sc-chart-icon');
    expect(chartIcon).toEqualAttribute('name', icon);
  });

  it('does not render icon when not enabled', async () => {
    const { statusCell } = await cellSpecPage({ icon: StatusIcon.ERROR, isEnabled: false });

    const chartIcon = statusCell.querySelector('sc-chart-icon');
    expect(chartIcon).toBeNull();
  });

  it('does not render icon when `icon` is not defined', async () => {
    const { statusCell } = await cellSpecPage({ icon: undefined });
    const chartIcon = statusCell.querySelector('sc-chart-icon');

    expect(chartIcon).toBeNull();
  });
});

it('should call updateName with correct props when label changed', async () => {
  const { page, statusCell, props } = await cellSpecPage({ propertyStream: DATA_STREAM });

  const streamName = statusCell.querySelector('monitor-data-stream-name') as HTMLMonitorDataStreamNameElement;

  const newName = 'New Name';

  streamName.onNameChange(newName);
  await page.waitForChanges();

  expect(props.onChangeLabel).toHaveBeenCalledWith(
    expect.objectContaining({ name: newName, streamId: DATA_STREAM.id })
  );
});
