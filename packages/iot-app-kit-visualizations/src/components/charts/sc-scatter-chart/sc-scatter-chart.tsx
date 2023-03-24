import { Component, Prop, h } from '@stencil/core';
import {
  AlarmsConfig,
  AppKitViewport,
  DataStream,
  MessageOverrides,
  MinimalSizeConfig,
  MinimalViewPortConfig,
} from '../../../utils/dataTypes';
import {
  Annotations,
  Axis,
  ChartConfig,
  LayoutConfig,
  LegendConfig,
  MovementConfig,
  ScaleConfig,
  Tooltip,
} from '../common/types';
import { chartScene, updateChartScene } from './chartScene';
import { DEFAULT_CHART_CONFIG } from '../sc-webgl-base-chart/chartDefaults';
import { RectScrollFixed } from '../../../utils/types';
import { Trend } from '../common/trends/types';
import { DATA_ALIGNMENT } from '../common/constants';
import { validate } from '../../common/validator/validate';
import { DataType } from '../../../utils/dataConstants';

// The initial size of buffers. The larger this is, the more memory allocated up front per chart.
// The lower this number is, more likely that charts will have to re-initialize there buffers which is
// a slow operation (CPU bound).
const DEFAULT_MIN_BUFFER_SIZE = 1000;
const DEFAULT_BUFFER_FACTOR = 2;

const tooltip = (props: Tooltip.Props) => (
  <iot-app-kit-vis-tooltip
    {...props}
    visualizesAlarms={false}
    supportString={false}
    dataAlignment={DATA_ALIGNMENT.EITHER}
  />
);
@Component({
  tag: 'iot-app-kit-vis-scatter-chart',
  shadow: false,
})
export class ScScatterChart implements ChartConfig {
  /** Chart API */
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() movement?: MovementConfig;
  @Prop() scale?: ScaleConfig;
  @Prop() layout?: LayoutConfig;
  @Prop() legend?: LegendConfig;
  @Prop() size?: MinimalSizeConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() alarms?: AlarmsConfig;
  @Prop() gestures: boolean = true;
  @Prop() annotations: Annotations;
  @Prop() trends: Trend[];
  @Prop() axis?: Axis.Options;
  @Prop() messageOverrides?: MessageOverrides;
  @Prop() setViewport: (viewport: AppKitViewport, lastUpdatedBy?: string) => void;

  /** Status */
  @Prop() isEditing: boolean = false;
  /** Memory Management */
  @Prop() bufferFactor: number = DEFAULT_BUFFER_FACTOR;
  @Prop() minBufferSize: number = DEFAULT_MIN_BUFFER_SIZE;

  componentWillRender() {
    validate(this);
  }

  render() {
    return (
      <iot-app-kit-vis-size-provider
        size={this.size}
        renderFunc={(rect: RectScrollFixed) => (
          <iot-app-kit-vis-webgl-base-chart
            supportedDataTypes={[DataType.NUMBER]}
            axis={this.axis}
            gestures={this.gestures}
            configId={this.widgetId}
            legend={this.legend}
            annotations={this.annotations}
            trends={this.trends}
            updateChartScene={updateChartScene}
            createChartScene={chartScene}
            size={{
              ...DEFAULT_CHART_CONFIG.size,
              ...this.size,
              ...rect,
            }}
            dataStreams={this.dataStreams}
            alarms={this.alarms}
            viewport={this.viewport}
            setViewport={this.setViewport}
            minBufferSize={this.minBufferSize}
            bufferFactor={this.bufferFactor}
            isEditing={this.isEditing}
            renderTooltip={tooltip}
            visualizesAlarms={false}
            messageOverrides={this.messageOverrides}
          />
        )}
      />
    );
  }
}
