import { Component, h, Prop } from '@stencil/core';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { activePoints, POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { LegendConfig, Threshold, ThresholdColorAndIcon } from '../common/types';
import { TrendResult } from '../common/trends/types';
import { getTrendValue } from '../common/trends/trendAnalysis';
import { getTrendLabel } from '../common/trends/trendConfig';
import { isSupportedDataType } from '../../../utils/predicates';
import { breachedThreshold } from '../common/annotations/breachedThreshold';
import { DATA_ALIGNMENT, LEGEND_POSITION } from '../common/constants';
import { StreamType } from '../../../utils/dataConstants';
import { Components } from '../../../components.d';

import MonitorLegendRow = Components.MonitorLegendRow;

const noop = () => {};

@Component({
  tag: 'monitor-legend',
  styleUrl: './monitor-legend.css',
  shadow: false,
})
export class MonitorLegend {
  @Prop() config!: LegendConfig;
  @Prop() viewPort!: ViewPort;
  @Prop() dataStreams!: DataStream[];
  @Prop() updateDataStreamName!: ({ streamId, name }: { streamId: string; name: string }) => void;
  @Prop() visualizesAlarms!: boolean;
  @Prop() isEditing: boolean = false;
  @Prop() isLoading!: boolean;
  @Prop() thresholds!: Threshold[];
  @Prop() supportString: boolean;
  @Prop() showDataStreamColor!: boolean;
  @Prop() trendResults: TrendResult[] = [];

  visualizedDataStreams = (): DataStream[] => {
    const streams = this.dataStreams.filter(isSupportedDataType(this.supportString));

    if (this.visualizesAlarms) {
      // Visualize all data streams with a valid data type
      return streams;
    }

    // Visualize only property-streams (non-alarms) with a valid data type
    return streams.filter(({ streamType }) => streamType !== StreamType.ALARM);
  };

  /**
   * Returns the given color of a breached threshold, if there is one.
   */
  breachedThresholdColor = (
    point: DataPoint | undefined,
    dataStream: DataStream
  ): ThresholdColorAndIcon | undefined => {
    const threshold = breachedThreshold({
      value: point && point.y,
      date: this.viewPort.end,
      dataStreams: this.dataStreams,
      dataStream,
      thresholds: this.thresholds,
    });

    return threshold ? { color: threshold.color, icon: threshold.icon } : undefined;
  };

  render() {
    const points = activePoints({
      viewPort: this.viewPort,
      dataStreams: this.dataStreams,
      selectedDate: this.viewPort.end,
      allowMultipleDates: true,
      dataAlignment: DATA_ALIGNMENT.EITHER,
    });

    const lastDate = points.length === 0 || points[0].point == null ? this.viewPort.end.getTime() : points[0].point.x;

    return (
      <div
        class="legend-container"
        style={{ flexDirection: this.config.position === LEGEND_POSITION.RIGHT ? 'column' : 'unset' }}
      >
        {this.visualizedDataStreams().map(dataStream => {
          const dataPoint = points.find(p => p.streamId === dataStream.id);
          const point = dataPoint ? dataPoint.point : undefined;
          const { color: valueColor = undefined, icon = undefined } =
            this.breachedThresholdColor(point, dataStream) || {};
          return [
            <monitor-legend-row
              streamId={dataStream.id}
              label={dataStream.name}
              detailedLabel={dataStream.detailedName}
              color={dataStream.color || 'black'}
              valueColor={valueColor}
              point={point}
              pointType={dataPoint && POINT_TYPE.DATA}
              unit={dataStream.unit}
              updateDataStreamName={this.updateDataStreamName}
              isEditing={this.isEditing}
              isLoading={this.isLoading}
              showDataStreamColor={this.showDataStreamColor}
              icon={icon}
            />,
            ...this.trendResults.reduce((rows: MonitorLegendRow[], trendResult: TrendResult) => {
              if (trendResult.dataStreamId === dataStream.id) {
                rows.push(
                  <monitor-legend-row
                    streamId={dataStream.id}
                    label={getTrendLabel(dataStream.name, trendResult.type)}
                    detailedLabel={dataStream.detailedName && getTrendLabel(dataStream.detailedName, trendResult.type)}
                    color={trendResult.color || dataStream.color || 'black'}
                    valueColor={valueColor}
                    point={{
                      x: lastDate,
                      y: getTrendValue(trendResult, lastDate),
                    }}
                    pointType={POINT_TYPE.TREND}
                    unit={dataStream.unit}
                    updateDataStreamName={noop}
                    isEditing={false}
                    isLoading={this.isLoading}
                    showDataStreamColor={this.showDataStreamColor}
                  />
                );
              }
              return rows;
            }, []),
          ];
        })}
      </div>
    );
  }
}
