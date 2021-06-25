/* eslint-disable max-len */
import { newSpecPage } from '@stencil/core/testing';

import { SpecPage } from '@stencil/core/internal';
import { Components } from '../../components.d';
import { ScWebglBaseChart } from '../../components/charts/sc-webgl-base-chart/sc-webgl-base-chart';
import { MonitorGestureHandler } from '../../components/charts/sc-webgl-base-chart/monitor-gesture-handler';
import { MonitorLineChart } from '../../components/charts/monitor-line-chart/monitor-line-chart';
import { MonitorSizeProvider } from '../../components/monitor-size-provider/monitor-size-provider';
import { CustomHTMLElement } from '../../utils/types';
import { LEGEND_POSITION } from '../..';
import { update } from '../../components/charts/common/tests/merge';
import { MonitorBarChart } from '../../components/charts/monitor-bar-chart/monitor-bar-chart';
import { MonitorScatterChart } from '../../components/charts/monitor-scatter-chart/monitor-scatter-chart';
import { MonitorStatusChart } from '../../components/charts/monitor-status-chart/monitor-status-chart';
import { ScWebglAxis } from '../../components/charts/sc-webgl-base-chart/sc-webgl-axis';
import { ScErrorBadge } from '../../components/sc-error-badge/sc-error-badge';
import { MonitorStatusTimelineOverlayRow } from '../../components/charts/monitor-status-chart/monitor-status-timeline-overlay/monitor-status-timeline-overlay-row';
import { MonitorStatusTimelineOverlay } from '../../components/charts/monitor-status-chart/monitor-status-timeline-overlay/monitor-status-timeline-overlay';
import { ScChartIcon } from '../../components/charts/chart-icon/sc-chart-icon';

const VIEW_PORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

export type ChartProps = Components.MonitorLineChart;

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
      MonitorGestureHandler,
      MonitorLineChart,
      MonitorBarChart,
      MonitorScatterChart,
      MonitorStatusChart,
      MonitorSizeProvider,
      ScWebglAxis,
      MonitorStatusTimelineOverlayRow,
      MonitorStatusTimelineOverlay,
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
    viewPort: VIEW_PORT,
    legend: {
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
