import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { DataPoint, DataStream, MessageOverrides, MinimalViewPortConfig, Primitive } from '../../utils/dataTypes';
import { NameValue, updateName } from '../sc-data-stream-name/helper';
import { ActivePoint, activePoints } from '../charts/sc-webgl-base-chart/activePoints';
import { getThresholds } from '../charts/common/annotations/utils';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { streamPairs } from '../../utils/streamPairs';
import { RenderCell } from './types';
import { viewportEndDate, viewportStartDate } from '../../utils/viewPort';
import { Annotations, ChartConfig, Threshold, WidgetConfigurationUpdate } from '../charts/common/types';
import { LabelsConfig } from '../common/types';
import { DATA_ALIGNMENT } from '../charts/common/constants';
import { isMinimalStaticViewport } from '../../utils/predicates';
import { parseDuration } from '../../utils/time';
import { getDataStreamForEventing } from '../charts/common';
import { validate } from '../common/validator/validate';
import { webGLRenderer } from '../sc-webgl-context/webglContext';

const MSG =
  'This visualization displays only live data. Choose a live time frame to display data in this visualization.';

const title = ({ alarm, property }: { alarm?: DataStream; property?: DataStream }): string => {
  if (property) {
    return property.detailedName || property.name;
  }
  if (alarm) {
    return alarm.detailedName || alarm.name;
  }
  return '';
};

/**
 * A generic parent container which can be utilized to construct a variety of 'grid-like' components.
 *
 * This component allows construction of widgets, by simply constructing the display cell via the `renderCell` method.gt
 */
@Component({
  tag: 'sc-widget-grid',
  styleUrl: 'sc-widget-grid.css',
  shadow: false,
})
export class ScWidgetGrid implements ChartConfig {
  @Prop() renderCell: RenderCell;

  @Prop() collapseVertically: boolean = true;

  /** Chart API */
  @Prop() labelsConfig?: LabelsConfig;
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() annotations: Annotations;
  @Prop() isEditing: boolean = false;

  @Prop() messageOverrides: MessageOverrides = {};
  @Prop() liveModeOnlyMessage: string = MSG;

  /** Widget data stream names */
  @State() names: NameValue[] = [];

  /** Active Viewport */
  @State() start: Date = viewportStartDate(this.viewport);
  @State() end: Date = viewportEndDate(this.viewport);
  @State() duration?: number = !isMinimalStaticViewport(this.viewport)
    ? parseDuration(this.viewport.duration)
    : undefined;

  @Event()
  widgetUpdated: EventEmitter<WidgetConfigurationUpdate>;

  componentWillRender() {
    validate(this);
  }

  componentDidLoad() {
    webGLRenderer.addChartScene({
      manager: {
        id: this.widgetId,
        viewportGroup: this.viewport.group,
        updateViewPort: this.onUpdate,
      },
      duration: this.duration,
    });
  }

  @Watch('viewport')
  onViewPortChange(newViewPort: MinimalViewPortConfig) {
    this.onUpdate({
      ...newViewPort,
      duration: !isMinimalStaticViewport(newViewPort) ? parseDuration(newViewPort.duration) : undefined,
      start: viewportStartDate(this.viewport),
      end: viewportEndDate(this.viewport),
    });
  }

  onUpdate = ({ start, end, duration }: { start: Date; end: Date; duration?: number }) => {
    // Update active viewport
    this.start = start;
    this.end = end;
    this.duration = duration;
  };

  disconnectedCallback() {
    // necessary to make sure that the allocated memory is released, and nothing is incorrectly rendered.
    webGLRenderer.removeChartScene(this.widgetId);
  }

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
      dataStreams: dataStreams ? getDataStreamForEventing(dataStreams) : this.dataStreams,
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
    const updatedDataStreams = this.dataStreams.map(dataStream => {
      const nameValue = this.names.find(({ id: nameId }) => dataStream.id === nameId);
      const name = nameValue != null ? nameValue.name : dataStream.name;
      return {
        ...dataStream,
        name,
      };
    });
    this.emitUpdatedWidgetConfiguration(updatedDataStreams);
  }

  onChangeLabel = ({ streamId, name }: { streamId: string; name: string }): void => {
    this.names = updateName(this.names, name, streamId);
    this.onWidgetUpdated();
  };

  getPoints = (): ActivePoint<Primitive>[] =>
    activePoints({
      viewport: {
        start: this.start,
        end: this.end,
      },
      dataStreams: this.rawData(),
      selectedDate: this.end,
      allowMultipleDates: true,
      dataAlignment: DATA_ALIGNMENT.EITHER,
    });

  getBreachedThreshold = (point: DataPoint | undefined, dataStream: DataStream): Threshold | undefined =>
    breachedThreshold({
      value: point && point.y,
      date: isMinimalStaticViewport(this.viewport) ? new Date(this.viewport.end) : new Date(),
      dataStreams: this.dataStreams,
      dataStream,
      thresholds: getThresholds(this.annotations),
    });

  /**
   * return all the raw data, that is, data that has no form of aggregation ran upon it. The data represents some
   * measurement, at a given point in time.
   */
  rawData = (): DataStream[] => this.dataStreams.filter(({ resolution }) => resolution === 0);

  render() {
    const isEnabled = this.duration != null;

    const points = this.getPoints();
    const pairs = streamPairs(this.dataStreams);

    const isMiniVersion = pairs.length > 1;
    return (
      <div class={{ tall: !this.collapseVertically }}>
        {!isEnabled && (
          <div class="help-icon-container">
            <sc-help-tooltip message={this.liveModeOnlyMessage} />
          </div>
        )}
        <sc-grid>
          {pairs.map(({ alarm, property }) => {
            const stream = alarm || property;
            if (stream == null) {
              return undefined;
            }

            const alarmPointWrapper = alarm && points.find(p => p.streamId === alarm.id);
            const propertyPointWrapper = property && points.find(p => p.streamId === property.id);
            const alarmPoint = alarmPointWrapper ? alarmPointWrapper.point : undefined;
            const propertyPoint = propertyPointWrapper ? propertyPointWrapper.point : undefined;

            const pointToEvaluateOn = alarmPoint || propertyPoint;
            const infoToEvaluateOn = alarm || property;
            const threshold =
              pointToEvaluateOn && infoToEvaluateOn && this.getBreachedThreshold(pointToEvaluateOn, infoToEvaluateOn);

            const alarmStream = alarm && this.rawData().find(s => s.id === alarm.id);
            const primaryStream = alarm ? alarmStream : property;

            return (
              <sc-grid-tooltip
                title={title({ alarm, property })}
                propertyPoint={propertyPoint}
                alarmPoint={alarmPoint}
                breachedThreshold={threshold}
                isEnabled={isEnabled}
              >
                {this.renderCell({
                  isEnabled,
                  trendStream: property,
                  propertyStream: property,
                  propertyPoint,
                  alarmStream,
                  alarmPoint,
                  breachedThreshold: threshold,
                  isEditing: this.isEditing,
                  viewport: { start: this.start, end: this.end },
                  miniVersion: isMiniVersion,
                  onChangeLabel: this.onChangeLabel,
                  messageOverrides: this.messageOverrides,
                  labelsConfig: this.labelsConfig,
                  icon: threshold ? threshold.icon : undefined,
                  valueColor: threshold ? threshold.color : undefined,
                  error: primaryStream ? primaryStream.error : undefined,
                  isLoading: primaryStream ? primaryStream.isLoading || false : false,
                  isRefreshing: primaryStream ? primaryStream.isRefreshing || false : false,
                })}
              </sc-grid-tooltip>
            );
          })}
        </sc-grid>
      </div>
    );
  }
}
