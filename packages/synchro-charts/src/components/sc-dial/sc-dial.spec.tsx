import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../utils/types';
import { ScSizeProvider } from '../sc-size-provider/sc-size-provider';
import { ScGridTooltip } from '../sc-widget-grid/sc-grid-tooltip';
import { ScWidgetGrid } from '../sc-widget-grid/sc-widget-grid';
import { DATA_STREAMS } from '../charts/common/tests/chart/constants';
import { ScDial } from './sc-dial';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { MINUTE_IN_MS } from '../../utils/time';
import { update } from '../charts/common/tests/merge';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';
import { StreamType } from '../../utils/dataConstants';
import { ScDialTooltip } from './sc-dial-base/sc-dial-tooltip';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
  yMin: 0,
  yMax: 5000,
};

const ASSOCIALTED_STREAMS = [
  {
    id: 'some-id',
    type: StreamType.ALARM,
  },
];

const newValueSpecPage = async (propOverrides: Partial<Components.ScDial> = {}) => {
  const page = await newSpecPage({
    components: [ScDial, ScSizeProvider, ScWidgetGrid, ScDialTooltip],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dial = page.doc.createElement('sc-dial') as CustomHTMLElement<Components.ScDial>;
  const props: Partial<Components.ScDial> = {
    widgetId: 'test-dial-widget',
    dataStream: DATA_STREAMS[0],
    viewport: VIEWPORT,
    ...propOverrides,
  };
  update(dial, props);
  page.body.appendChild(dial);

  await page.waitForChanges();

  return { page, dial };
};

describe('when enabled', () => {
  it('renders a base dial', async () => {
    const { dial } = await newValueSpecPage({ dataStream: DATA_STREAM, associatedStreams: ASSOCIALTED_STREAMS });

    const dialBases = dial.querySelectorAll('sc-dial-base');

    expect(dialBases.length).toBe(1);
  });

  //   it('renders cell', async () => {
  //     const { renderCell } = await newValueSpecPage();
  //     expect(renderCell).toBeCalled();
  //   });

  //   it('renders base dial per numerical data stream', async () => {
  //     const dataStreams = [DATA_STREAM, STRING_STREAM_1, STRING_STREAM_2];

  //     const { dial } = await newValueSpecPage({ dataStreams });

  //     const dialBases = dial.querySelectorAll('sc-dial-base');
  //     expect(dialBases.length).toBe(dataStreams.length);
  //   });

  //   it('does render string data streams', async () => {
  //     const { dial } = await newValueSpecPage({ dataStreams: [STRING_STREAM_1] });

  //     const dialBases = dial.querySelectorAll('sc-dial-base');
  //     expect(dialBases).toHaveLength(1);
  //   });

  //   it('does not render a help icon', async () => {
  //     const viewport: MinimalLiveViewport = {
  //       yMin: 0,
  //       yMax: 10000,
  //       duration: MINUTE_IN_MS,
  //     };
  //     const { dial } = await newValueSpecPage({ viewport });

  //     expect(dial.querySelector('sc-help-tooltip')).toBeNull();
  //   });

  //   it('displays error from data stream', async () => {
  //     const error = 'some error';
  //     const { dial } = await newValueSpecPage({
  //       dataStreams: [
  //         {
  //           ...DATA_STREAM,
  //           error,
  //         },
  //       ],
  //       annotations: { y: [ALARM_THRESHOLD] },
  //     });

  //     const cell = dial.querySelector('sc-dial-base');
  //     expect(cell).toEqualAttribute('error', error);
  //   });

  //   describe('alarms', () => {
  //     const pointInViewport: DataPoint<number> = {
  //       x: new Date(2000, 0, 0).getTime(),
  //       y: 100,
  //     };

  //     it('with an alarm data stream that is breached, display the color of the breached threshold', async () => {
  //       const stream = { ...DATA_WITH_ALARM_ASSOCIATION, data: [pointInViewport] };

  //       const { dial } = await newValueSpecPage({
  //         dataStreams: [ALARM_STREAM, stream],
  //         annotations: { y: [ALARM_THRESHOLD] },
  //       });

  //       const cells = dial.querySelectorAll('sc-dial-base');
  //       expect(cells).toHaveLength(1);

  //       const cell = cells[0];

  //       expect(cell.isEnabled).not.toBeFalse();

  //       expect(cell.alarmStream).toBe(ALARM_STREAM);
  //       expect(cell.alarmPoint).toBe(ALARM_STREAM.data[0]);

  //       expect(cell.propertyStream).toBe(stream);
  //       expect(cell.propertyPoint).toBe(pointInViewport);
  //     });

  //     it('with an alarm data stream that is breached, display the color of the breached threshold only on alarm stream when alarm is not associated', async () => {
  //       const stream = { ...DATA_STREAM, data: [pointInViewport] };
  //       const { dial } = await newValueSpecPage({
  //         dataStreams: [stream, ALARM_STREAM],
  //         annotations: { y: [ALARM_THRESHOLD] },
  //       });

  //       const cells = dial.querySelectorAll('sc-dial-base');
  //       expect(cells).toHaveLength(2);

  //       const propertyCell = cells[0];
  //       expect(propertyCell.propertyStream).toBe(stream);
  //       expect(propertyCell.propertyPoint).toBe(pointInViewport);

  //       expect(propertyCell.alarmStream).toBeUndefined();
  //       expect(propertyCell.alarmPoint).toBeUndefined();

  //       expect(propertyCell).not.toHaveAttribute('valueColor');
  //       expect(propertyCell).not.toHaveAttribute('icon');

  //       const alarmCell = cells[1];
  //       expect(alarmCell.alarmPoint).toBe(ALARM_STREAM.data[0]);
  //       expect(alarmCell.alarmStream).toBe(ALARM_STREAM);

  //       expect(alarmCell.propertyPoint).toBeUndefined();
  //       expect(alarmCell.propertyStream).toBeUndefined();

  //       expect(alarmCell).toEqualAttribute('valueColor', ALARM_THRESHOLD.color);
  //       expect(alarmCell).toEqualAttribute('icon', ALARM_THRESHOLD.icon);
  //     });
  //   });
});

// describe('when disabled', () => {
//   it('renders base kpi per data stream', async () => {
//     const NON_LIVE_VIEWPORT = {
//       ...DEFAULT_CHART_CONFIG.viewport,
//     };

//     const dataStreams = [STRING_STREAM_1, STRING_STREAM_2, DATA_STREAM, ALARM_STREAM];

//     const { dial } = await newValueSpecPage({
//       viewport: NON_LIVE_VIEWPORT,
//       dataStreams,
//     });

//     const dialBases = dial.querySelectorAll('sc-dial-base');
//     expect(dialBases.length).toBe(dataStreams.length);
//   });

//   it('renders a help icon', async () => {
//     const NON_LIVE_VIEWPORT = {
//       ...DEFAULT_CHART_CONFIG.viewport,
//     };

//     const { dial } = await newValueSpecPage({
//       viewport: NON_LIVE_VIEWPORT,
//     });

//     expect(dial.querySelector('sc-help-tooltip')).not.toBeNull();
//   });
// });
