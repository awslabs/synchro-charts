import { Component, h, Prop } from '@stencil/core';
import { DataPoint, DataStream, StreamAssociation, ViewPortConfig } from '../../utils/dataTypes';
import { Annotations, Threshold } from '../charts/common/types';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { isMinimalStaticViewport } from '../../utils/predicates';
import { getNumberThresholds, getThresholds, sortThreshold } from '../charts/common/annotations/utils';
import { DialMessages, DialSizeConfig } from '../sc-dial/utils/type';
import { RecursivePartial } from '../common/types';
import { GuageOuterRing } from './utils/type';

@Component({
  tag: 'sc-gauge',
  styleUrl: 'sc-gauge.css',
  shadow: false,
})
export class ScGauge {
  @Prop() viewport!: ViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStream!: DataStream;
  @Prop() associatedStreams?: StreamAssociation[];
  @Prop() annotations?: Annotations;
  @Prop() size?: DialSizeConfig;
  @Prop() messageOverrides?: RecursivePartial<DialMessages>;
  @Prop() significantDigits?: number;

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

  getRingRange = (): GuageOuterRing[] | undefined => {
    const annotations = getThresholds(this.annotations);
    if (annotations.length === 0) {
      return undefined;
    }

    const { yMin = 0, yMax = 0 } = this.viewport;
    const distance = yMax - yMin;
    const numberThresholds = getNumberThresholds(annotations);
    const sortedThresholds = sortThreshold(numberThresholds);

    const splitThresholds: { L: GuageOuterRing[]; G: GuageOuterRing[] } = {
      L: [],
      G: [],
    };
    sortedThresholds.forEach(res => {
      splitThresholds[res.comparisonOperator.charAt(0)].push({
        percent: 0,
        value: res.value,
        color: res.color,
      });
    });
    splitThresholds.L.unshift({
      percent: 0,
      value: yMin,
      color: '',
      showValue: yMin,
    });

    splitThresholds.L = splitThresholds.L.map(
      (threshold: GuageOuterRing): GuageOuterRing => {
        const percent = (threshold.value as number) / distance;
        const showValue = threshold.value;

        return { ...threshold, percent, showValue };
      }
    );
    splitThresholds.G = splitThresholds.G.map(
      (threshold: GuageOuterRing, index: number, arrays: GuageOuterRing[]): GuageOuterRing => {
        const { length } = splitThresholds.G;
        let percent = 0;
        let showValue: string | number;
        if (index === length - 1) {
          percent = 1;
          showValue = distance;
        } else {
          percent = (arrays[index + 1].value as number) / distance;
          showValue = `${arrays[index + 1].value}`;
        }
        return { ...threshold, percent, showValue };
      }
    );

    const outerRingRange = splitThresholds.L.concat(splitThresholds.G);

    return outerRingRange;
  };

  render() {
    const propertyPoint = this.getPoint(this.dataStream);
    const alarmStream = this.getAlarmStream(this.dataStream) ? this.dataStream : undefined;
    const threshold = alarmStream ? this.getBreachedThreshold(propertyPoint, this.dataStream) : undefined;

    return (
      <sc-gauge-base
        propertyStream={this.dataStream}
        propertyPoint={propertyPoint}
        alarmStream={alarmStream}
        breachedThreshold={threshold}
        viewport={this.viewport}
        size={this.size}
        messageOverrides={this.messageOverrides}
        isLoading={this.dataStream ? this.dataStream.isLoading || false : false}
        significantDigits={this.significantDigits}
        outerRingRange={this.getRingRange()}
      />
    );
  }
}
