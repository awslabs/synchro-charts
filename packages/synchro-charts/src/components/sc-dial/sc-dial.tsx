import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import {
  DataPoint,
  DataStream,
  MessageOverrides,
  MinimalSizeConfig,
  SizeConfig,
  StreamAssociation,
  ViewPortConfig,
} from '../../utils/dataTypes';
import { Annotations, DialConfig, Threshold, WidgetConfigurationUpdate } from '../charts/common/types';
import { validate } from '../common/validator/validate';
import { NameValue, updateName } from '../sc-data-stream-name/helper';
import { getDataStreamForEventing } from '../charts/common';
import { RenderCell } from './type';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { isMinimalStaticViewport } from '../../utils/predicates';
import { getThresholds } from '../charts/common/annotations/utils';
import { RectScrollFixed } from '../../utils/types';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';

const renderCell: RenderCell = props => <sc-dial-base {...props} />;

const DEFAULT_MARGINS: Partial<SizeConfig> = {
  marginLeft: 10,
  marginTop: 0,
  marginBottom: DEFAULT_CHART_CONFIG.size.marginBottom,
  marginRight: 5,
};

// Fits two rows of legend rows
const THRESHOLD_LEGEND_HEIGHT_PX = 50;
@Component({
  tag: 'sc-dial',
  styleUrl: 'sc-dial.css',
  shadow: true,
})
export class ScDial implements DialConfig {
  @Prop() viewport: ViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStream!: DataStream;
  @Prop() associatedStreams?: StreamAssociation[];
  @Prop() annotations?: Annotations;
  @Prop() messageOverrides: MessageOverrides = {};

  @Prop() size?: MinimalSizeConfig = { width: 276, height: 276 };

  @Event()
  widgetUpdated: EventEmitter<WidgetConfigurationUpdate>;

  /** Widget data stream names */
  @State() names: NameValue[] = [];

  componentWillRender() {
    validate(this);
  }

  getPoint = (dataStream: DataStream): DataPoint | undefined => {
    if (dataStream.data && dataStream.data.length > 0) {
      const point = dataStream.data[dataStream.data.length - 1];
      return point;
    }

    return undefined;
  };

  getAlarmStream = (dataStream: DataStream): boolean => {
    return !!this.associatedStreams && this.associatedStreams.some(stream => stream.id === dataStream.id);
  };

  getBreachedThreshold = (point: DataPoint | undefined, dataStream: DataStream): Threshold | undefined =>
    breachedThreshold({
      value: point && point.y,
      date: isMinimalStaticViewport(this.viewport) ? new Date(this.viewport.end) : new Date(),
      dataStreams: [this.dataStream],
      dataStream,
      thresholds: getThresholds(this.annotations),
    });

  /**
   * Emit the current widget configuration
   */
  emitUpdatedWidgetConfiguration = (dataStreams?: DataStream[]): void => {
    const configUpdate: WidgetConfigurationUpdate = {
      movement: undefined,
      scale: undefined,
      layout: undefined,
      legend: undefined,
      annotations: this.annotations,
      axis: undefined,
      widgetId: this.widgetId,
      dataStreams: dataStreams ? getDataStreamForEventing(dataStreams) : [this.dataStream],
    };
    this.widgetUpdated.emit(configUpdate);
  };

  /**
   * On Widget Updated - Persist `DataStreamInfo`
   *
   * Emits an event which persists the current `NameValue[]` state into the
   * data stream info.
   */
  onWidgetUpdated() {
    // Construct the config update with the new names specified.
    const nameValue = this.names.find(({ id: nameId }) => this.dataStream.id === nameId);
    const name = nameValue != null ? nameValue.name : this.dataStream.name;
    const updatedDataStream = { ...this.dataStream, name };
    this.emitUpdatedWidgetConfiguration([updatedDataStream]);
  }

  onChangeLabel = ({ streamId, name }: { streamId: string; name: string }): void => {
    this.names = updateName(this.names, name, streamId);
    this.onWidgetUpdated();
  };

  render() {
    const propertyPoint = this.getPoint(this.dataStream);
    const alarmStream = this.getAlarmStream(this.dataStream) ? this.dataStream : undefined;
    const threshold = alarmStream
      ? getThresholds(this.annotations).filter(a => a.icon)[0] ||
        this.getBreachedThreshold(propertyPoint, this.dataStream)
      : undefined;
    return (
      <sc-size-provider
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
            <div style={{ height: `${chartSize.height}px`, width: `${chartSize.width}px` }}>
              {renderCell({
                propertyStream: this.dataStream,
                propertyPoint,
                alarmStream,
                breachedThreshold: threshold,
                viewport: this.viewport,
                messageOverrides: this.messageOverrides,
                icon: threshold ? threshold.icon : undefined,
                valueColor: threshold ? threshold.color : undefined,
                error: this.dataStream ? this.dataStream.error : undefined,
                isLoading: this.dataStream ? this.dataStream.isLoading || false : false,
                isRefreshing: this.dataStream ? this.dataStream.isRefreshing || false : false,
                size: chartSize,
              })}
            </div>,
          ];
        }}
      />
    );
  }
}
