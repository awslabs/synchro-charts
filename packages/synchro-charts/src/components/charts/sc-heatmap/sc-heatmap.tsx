import { Component, h, Prop, State } from '@stencil/core';

import {
  AlarmsConfig,
  DataStream,
  MessageOverrides,
  MinimalSizeConfig,
  MinimalViewPortConfig,
  RequestDataFn,
} from '../../../utils/dataTypes';
import { Axis, ChartConfig, LayoutConfig, LegendConfig, MovementConfig, ScaleConfig, Tooltip } from '../common/types';
import { chartScene, updateChartScene } from './chartScene';
import { DEFAULT_CHART_CONFIG } from '../sc-webgl-base-chart/chartDefaults';
import { RectScrollFixed } from '../../../utils/types';
import { DATA_ALIGNMENT } from '../common/constants';
import { HeatValueMap } from './heatmapUtil';
import { heatValues } from './heatmapMesh';

// The initial size of buffers. The larger this is, the more memory allocated up front per chart.
// The lower this number is, more likely that charts will have to re-initialize there buffers which is
// a slow operation (CPU bound).
const DEFAULT_MIN_BUFFER_SIZE = 1000;
const DEFAULT_BUFFER_FACTOR = 2;

const tooltip = (props: Tooltip.Props) => (
  <sc-heatmap-tooltip
    size={props.size}
    viewport={props.viewport}
    dataContainer={props.dataContainer}
    dataAlignment={DATA_ALIGNMENT.EITHER}
    heatValues={heatValues}
  />
);

@Component({
  tag: 'sc-heatmap',
  shadow: false,
})
export class ScHeatmap implements ChartConfig {
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
  @Prop() requestData?: RequestDataFn;
  @Prop() axis?: Axis.Options;
  @Prop() messageOverrides?: MessageOverrides;
  // @Prop() heatValues: HeatValueMap;
  /** Status */
  @Prop() isEditing: boolean = false;
  /** Memory Management */
  @Prop() bufferFactor: number = DEFAULT_BUFFER_FACTOR;
  @Prop() minBufferSize: number = DEFAULT_MIN_BUFFER_SIZE;

  @State() heatValues: HeatValueMap = {};

  render() {
    return (
      <sc-size-provider
        size={this.size}
        renderFunc={(size: RectScrollFixed) => (
          <sc-webgl-base-chart
            {...this.heatValues}
            axis={this.axis}
            gestures={this.gestures}
            configId={this.widgetId}
            requestData={this.requestData}
            legend={this.legend}
            updateChartScene={updateChartScene}
            createChartScene={chartScene}
            size={{
              ...DEFAULT_CHART_CONFIG.size,
              ...this.size,
              ...size,
            }}
            dataStreams={this.dataStreams}
            alarms={this.alarms}
            viewport={this.viewport}
            minBufferSize={this.minBufferSize}
            bufferFactor={this.bufferFactor}
            isEditing={this.isEditing}
            yRangeStartFromZero
            tooltip={tooltip}
            supportString={false}
            visualizesAlarms={false}
            messageOverrides={this.messageOverrides}
          />
        )}
      />
    );
  }
}
