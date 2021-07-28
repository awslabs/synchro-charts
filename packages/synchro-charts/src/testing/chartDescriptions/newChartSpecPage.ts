/* eslint-disable max-len */
import { newSpecPage } from '@stencil/core/testing';

import { SpecPage } from '@stencil/core/internal';
import { Components } from '../../components.d';
import { ScWebglBaseChart } from '../../components/charts/sc-webgl-base-chart/sc-webgl-base-chart';
import { ScGestureHandler } from '../../components/charts/sc-webgl-base-chart/sc-gesture-handler';
import { ScLineChart } from '../../components/charts/sc-line-chart/sc-line-chart';
import { ScSizeProvider } from '../../components/sc-size-provider/sc-size-provider';
import { CustomHTMLElement } from '../../utils/types';
import { LEGEND_POSITION } from '../..';
import { update } from '../../components/charts/common/tests/merge';
import { ScBarChart } from '../../components/charts/sc-bar-chart/sc-bar-chart';
import { ScScatterChart } from '../../components/charts/sc-scatter-chart/sc-scatter-chart';
import { ScStatusTimeline } from '../../components/charts/sc-status-timeline/sc-status-timeline';
import { ScWebglAxis } from '../../components/charts/sc-webgl-base-chart/sc-webgl-axis';
import { ScErrorBadge } from '../../components/sc-error-badge/sc-error-badge';
import { ScStatusTimelineOverlayRow } from '../../components/charts/sc-status-timeline/sc-status-timeline-overlay/sc-status-timeline-overlay-row';
import { ScStatusTimelineOverlay } from '../../components/charts/sc-status-timeline/sc-status-timeline-overlay/sc-status-timeline-overlay';
import { ScChartIcon } from '../../components/charts/chart-icon/sc-chart-icon';

const VIEWPORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

export type ChartProps = Components.ScLineChart;

export type ChartSpecPage = (props: Partial<ChartProps>) => Promise<{ page: SpecPage; chart: HTMLElement }>;

export interface DisableList {
  annotations?: boolean;
  trends?: boolean;
  viewport?: boolean;
  yRange?: boolean;
  legend?: boolean;
}

export const newChartSpecPage = (tagName: string): ChartSpecPage => async props => {
  const page = await newSpecPage({
    components: [
      ScWebglBaseChart,
      ScGestureHandler,
      ScLineChart,
      ScBarChart,
      ScScatterChart,
      ScStatusTimeline,
      ScSizeProvider,
      ScWebglAxis,
      ScStatusTimelineOverlayRow,
      ScStatusTimelineOverlay,
      ScChartIcon,
      ScErrorBadge,
    ],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const chart = page.doc.createElement(tagName) as CustomHTMLElement<ChartProps>;

  const defaultProps: ChartProps = {
    widgetId: 'default-id',
    gestures: true,
    viewport: VIEWPORT,
    legendConfig: {
      position: LEGEND_POSITION.BOTTOM,
      width: 300,
    },
    annotations: {
      x: [],
      y: [],
    },
    trends: [],
    dataStreams: [],
    bufferFactor: 1,
    minBufferSize: 1,
    isEditing: false,
  };

  update(chart, {
    ...defaultProps,
    ...props,
  } as ChartProps);

  page.body.appendChild(chart);
  await page.waitForChanges();
  return { page, chart };
};
