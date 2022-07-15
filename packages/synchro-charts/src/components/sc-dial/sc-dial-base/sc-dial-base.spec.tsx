// import { newSpecPage } from '@stencil/core/testing';
// import { Components } from '../../../components.d';
// import { CustomHTMLElement } from '../../../utils/types';
// import { ScSizeProvider } from '../../sc-size-provider/sc-size-provider';
// import { ScGridTooltip } from '../../sc-widget-grid/sc-grid-tooltip';
// import { ScWidgetGrid } from '../../sc-widget-grid/sc-widget-grid';
// import { DATA_STREAMS } from '../../charts/common/tests/chart/constants';
// import { ScDialBase } from './sc-dial-base';
// import { update } from '../../charts/common/tests/merge';
// import { DEFAULT_CHART_CONFIG } from '../../charts/sc-webgl-base-chart/chartDefaults';
// import { MINUTE_IN_MS } from '../../../utils/time';
// import { DATA_STREAM } from '../../../testing/__mocks__/mockWidgetProperties';
// import { DEFAULT_MESSAGE_OVERRIDES } from '../../../utils/dataTypes';

// const VIEWPORT = {
//   ...DEFAULT_CHART_CONFIG.viewport,
//   duration: MINUTE_IN_MS,
//   yMin: 0,
//   yMax: 5000,
// };

// const newValueSpecPage = async (propOverrides: Partial<Components.ScDialBase> = {}) => {
//   const page = await newSpecPage({
//     components: [ScDialBase, ScSizeProvider, ScWidgetGrid, ScGridTooltip],
//     html: '<div></div>',
//     supportsShadowDom: false,
//   });
//   const dialBase = page.doc.createElement('sc-dial-base') as CustomHTMLElement<Components.ScDialBase>;
//   const props: Partial<Components.ScKpi> = {
//     widgetId: 'test-dial-base-widget',
//     isEditing: false,
//     dataStreams: DATA_STREAMS,
//     viewport: VIEWPORT,
//     ...propOverrides,
//   };
//   update(dialBase, props);
//   page.body.appendChild(dialBase);

//   await page.waitForChanges();

//   return { page, dialBase };
// };

// describe('messageOverrides', () => {
//   it.skip('when override provided, utilize it', async () => {
//     const MY_MSG_OVERRIDE = 'MY_MSG_OVERRIDE';
//     const { dialBase } = await newValueSpecPage({
//       // Setup scenario where the 'live time frame value label' renders
//       propertyPoint: {
//         x: Date.now(),
//         y: 123,
//       },
//       propertyStream: DATA_STREAM,
//     });

//     expect(dialBase.innerHTML).not.toContain(DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel);
//     expect(dialBase.innerHTML).toContain(MY_MSG_OVERRIDE);
//   });
// });
