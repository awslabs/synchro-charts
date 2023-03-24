import { Component, h, Prop, State, Watch } from '@stencil/core';

import {
  AlarmsConfig,
  AppKitViewport,
  DataStream,
  MessageOverrides,
  MinimalSizeConfig,
  MinimalViewPortConfig,
  SizeConfig,
} from '../../../utils/dataTypes';
import {
  Annotations,
  Axis,
  ChartConfig,
  LayoutConfig,
  MovementConfig,
  ScaleConfig,
  Threshold,
  Tooltip,
} from '../common/types';
import { chartScene, updateChartScene } from './chartScene';
import { DEFAULT_CHART_CONFIG } from '../sc-webgl-base-chart/chartDefaults';
import { RectScrollFixed } from '../../../utils/types';
import { HEIGHT, STATUS_MARGIN_TOP_PX } from './constants';
import { isThreshold } from '../common/annotations/utils';
import { DATA_ALIGNMENT } from '../common/constants';
import { isMinimalStaticViewport } from '../../../utils/predicates';
import { validate } from '../../common/validator/validate';
import { DataType } from '../../../utils/dataConstants';

// The initial size of buffers. The larger this is, the more memory allocated up front per chart.
// The lower this number is, more likely that charts will have to re-initialize there buffers which is
// a slow operation (CPU bound).
const DEFAULT_MIN_BUFFER_SIZE = 1000;
const DEFAULT_BUFFER_FACTOR = 4;

const DEFAULT_MARGINS: Partial<SizeConfig> = {
  marginLeft: 10,
  marginTop: 0,
  marginBottom: DEFAULT_CHART_CONFIG.size.marginBottom,
  marginRight: 5,
};

// Fits two rows of legend rows
const THRESHOLD_LEGEND_HEIGHT_PX = 50;

const TOP_TOOLTIP_MARGIN_PX = 4;

const tooltip = (alarms?: AlarmsConfig) => (props: Tooltip.Props) => {
  const { size } = props;
  return (
    <iot-app-kit-vis-tooltip
      {...props}
      dataAlignment={DATA_ALIGNMENT.LEFT}
      top={-size.height + STATUS_MARGIN_TOP_PX + TOP_TOOLTIP_MARGIN_PX}
      sortPoints={false}
      maxDurationFromDate={alarms ? alarms.expires : undefined}
      showDataStreamColor={false}
      showBlankTooltipRows
      visualizesAlarms
      supportString
    />
  );
};

const getComponentViewport = (viewport: MinimalViewPortConfig): MinimalViewPortConfig => ({
  ...viewport,
  yMin: 0,
  yMax: HEIGHT,
});

@Component({
  tag: 'iot-app-kit-vis-status-timeline',
  styleUrl: './sc-status-timeline.css',
  shadow: false,
})
export class ScStatusTimeline implements ChartConfig {
  /** Chart API */
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() gestures: boolean = true;
  @Prop() movement?: MovementConfig;
  @Prop() scale?: ScaleConfig;
  @Prop() layout?: LayoutConfig;
  @Prop() size?: MinimalSizeConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() annotations?: Annotations;
  @Prop() axis?: Axis.Options;
  @Prop() messageOverrides?: MessageOverrides;
  @Prop() alarms?: AlarmsConfig;
  @Prop() setViewport: (viewport: AppKitViewport, lastUpdatedBy?: string) => void;

  @State() componentViewport: MinimalViewPortConfig;

  /** Status */
  @Prop() isEditing: boolean = false;
  /** Memory Management */
  @Prop() bufferFactor: number = DEFAULT_BUFFER_FACTOR;
  @Prop() minBufferSize: number = DEFAULT_MIN_BUFFER_SIZE;

  thresholds = (): Threshold[] => {
    if (this.annotations == null || this.annotations.y == null) {
      return [];
    }

    return this.annotations.y.filter(isThreshold);
  };

  componentWillRender() {
    validate(this);
  }

  componentWillLoad() {
    this.componentViewport = getComponentViewport(this.viewport);
  }

  @Watch('viewport')
  onViewportChange() {
    this.componentViewport = getComponentViewport(this.viewport);
  }

  render() {
    return (
      <iot-app-kit-vis-size-provider
        size={this.size}
        renderFunc={(size: RectScrollFixed) => {
          const totalSize = {
            ...DEFAULT_CHART_CONFIG.size,
            ...DEFAULT_MARGINS,
            ...this.size,
            ...size,
          };

          const chartHeight = totalSize.height - THRESHOLD_LEGEND_HEIGHT_PX;
          const chartSize = {
            ...totalSize,
            height: chartHeight,
          };

          return [
            <div class="status-timeline" style={{ height: `${chartSize.height}px` }}>
              <iot-app-kit-vis-webgl-base-chart
                axis={{
                  ...this.axis,
                  showY: false,
                }}
                gestures={this.gestures}
                configId={this.widgetId}
                annotations={{
                  ...this.annotations,
                  show: false,
                  thresholdOptions: {
                    showColor: true,
                  },
                }}
                supportedDataTypes={[DataType.NUMBER, DataType.STRING, DataType.BOOLEAN]}
                updateChartScene={updateChartScene}
                createChartScene={chartScene}
                size={chartSize}
                dataStreams={this.dataStreams}
                alarms={this.alarms}
                viewport={this.componentViewport}
                setViewport={this.setViewport}
                minBufferSize={this.minBufferSize}
                bufferFactor={this.bufferFactor}
                isEditing={this.isEditing}
                renderTooltip={tooltip(this.alarms)}
                displaysError={false}
                supportString
                visualizesAlarms
                displaysNoDataPresentMsg={false}
                messageOverrides={this.messageOverrides}
              />
              <iot-app-kit-vis-status-timeline-overlay
                isEditing={this.isEditing}
                thresholds={this.thresholds()}
                date={isMinimalStaticViewport(this.viewport) ? new Date(this.viewport.end) : new Date()}
                dataStreams={this.dataStreams}
                size={chartSize}
                widgetId={this.widgetId}
              />
            </div>,
            <div class="threshold-legend-container" style={{ maxHeight: `${THRESHOLD_LEGEND_HEIGHT_PX}px` }}>
              <iot-app-kit-vis-threshold-legend thresholds={this.thresholds()} />
            </div>,
          ];
        }}
      />
    );
  }
}
