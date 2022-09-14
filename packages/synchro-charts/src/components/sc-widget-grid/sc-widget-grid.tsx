import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { viewportManager } from '@iot-app-kit/core';

import throttle from 'lodash.throttle';
import {
  DataPoint,
  DataStream,
  DEFAULT_MESSAGE_OVERRIDES,
  MessageOverrides,
  MinimalViewPortConfig,
  Primitive,
} from '../../utils/dataTypes';
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
import { DATE_RANGE_EMIT_EVENT_MS } from '../common/constants';

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

  /**
   * On view port date range change, this component emits a `dateRangeChange` event.
   * This allows other data visualization components to sync to the same date range.
   */
  @Event() dateRangeChange: EventEmitter<[Date, Date, string | undefined]>;

  /** Chart API */
  @Prop() labelsConfig?: LabelsConfig;
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() annotations: Annotations;
  @Prop() isEditing: boolean = false;

  @Prop() messageOverrides: MessageOverrides = {};

  /** Widget data stream names */
  @State() names: NameValue[] = [];

  /** Active Viewport */
  @State() start: Date;
  @State() end: Date;
  @State() duration;

  @Event()
  widgetUpdated: EventEmitter<WidgetConfigurationUpdate>;

  private unsubscribeFromViewportGroup : () => void | undefined;

  componentWillLoad() {
    this.updateViewport(this.viewport);
    this.subscribeToViewportGroup();
  }

  componentWillRender() {
    validate(this);
  }

  onDateRangeChange = throttle(
    ([start, end, from]: [Date, Date, string | undefined]) => {
      this.dateRangeChange.emit([start, end, from]);
    },
    DATE_RANGE_EMIT_EVENT_MS,
    {
      leading: true,
      trailing: true,
    }
  );

  subscribeToViewportGroup = () => {
    if (this.viewport.group != null) {
      const { viewport, unsubscribe } = viewportManager.subscribe(this.viewport.group, this.updateViewport);
      this.unsubscribeFromViewportGroup = unsubscribe;
      if (viewport) {
        this.updateViewport(viewport);
      } else {
        viewportManager.update(this.viewport.group, this.viewport);
      }
    }
  };

  @Watch('viewport')
  onViewPortChange(viewport: MinimalViewPortConfig) {
    this.updateViewport(viewport);
  }

  updateViewport = (viewport: MinimalViewPortConfig) => {
    const duration = 'duration' in viewport ? parseDuration(viewport.duration) : undefined;
    const start = viewportStartDate(viewport);
    const end = viewportEndDate(viewport);

    const hasViewPortChanged =
      viewportStartDate(this.viewport).getTime() !== start.getTime() ||
      viewportEndDate(this.viewport).getTime() !== end.getTime();
    if (hasViewPortChanged) {
      this.onDateRangeChange([start, end, this.viewport.group]);
    }
    // Update active viewport
    this.start = start;
    this.end = end;
    this.duration = duration;
  };

  disconnectedCallback() {
    if (this.unsubscribeFromViewportGroup) {
      this.unsubscribeFromViewportGroup();
    }
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
      dataStreams: this.dataStreams,
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

  render() {
    const isEnabled = this.duration != null;

    const points = this.getPoints();
    const pairs = streamPairs(this.dataStreams);

    const isMiniVersion = pairs.length > 1;
    return (
      <div class={{ tall: !this.collapseVertically }}>
        {!isEnabled && (
          <div class="help-icon-container">
            <sc-help-tooltip message={this.messageOverrides?.liveModeOnly ?? DEFAULT_MESSAGE_OVERRIDES.liveModeOnly} />
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

            const alarmStream = alarm && this.dataStreams.find(s => s.id === alarm.id);
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
