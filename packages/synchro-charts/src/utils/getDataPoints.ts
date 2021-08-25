import { AggregateType, DataPoint, DataStream, Primitive, Resolution } from './dataTypes';

/**
 * Get the points for a given resolution (and an optional aggregate type) from a data stream
 */
export const getDataPoints = <T extends Primitive>(stream: DataStream<T>, resolution: Resolution, aggregateType?: AggregateType | undefined): DataPoint<T>[] => {
  if (resolution === 0) {
    return stream.data;
  }

  if (stream.aggregates == null) {
    return [];
  }

  if (!stream.aggregates[resolution]) {
    return [];
  }

  // if no aggregate type was specified
  if (!aggregateType && stream.aggregates[resolution] != undefined) {
    const datapoints = stream.aggregates[resolution] as DataPoint<T>[] | { [aggregationType: string] : DataPoint<T>[] | undefined };
    if (datapoints[AggregateType.AVERAGE] != undefined) {
      return datapoints[AggregateType.AVERAGE];
    }
    else if (datapoints != undefined &&
      !datapoints[AggregateType.AVERAGE] &&
      !datapoints[AggregateType.MINIMUM] &&
      !datapoints[AggregateType.MAXIMUM] &&
      !datapoints[AggregateType.SUM] &&
      !datapoints[AggregateType.COUNT] &&
      !datapoints[AggregateType.STANDARD_DEVIATION]
      ) {
        return datapoints as DataPoint<T>[] || [];
    }
    return [];
  }

  // if an aggregate type was specified
  if (aggregateType && stream.aggregates[resolution] != undefined) {
    const datapoints = stream.aggregates[resolution] as DataPoint<T>[] | { [aggregationType: string] : DataPoint<T>[] | undefined };
    if (datapoints[aggregateType] != undefined) {
      return datapoints[aggregateType];
    }
    else if (datapoints != undefined &&
      !datapoints[AggregateType.AVERAGE] &&
      !datapoints[AggregateType.MINIMUM] &&
      !datapoints[AggregateType.MAXIMUM] &&
      !datapoints[AggregateType.SUM] &&
      !datapoints[AggregateType.COUNT] &&
      !datapoints[AggregateType.STANDARD_DEVIATION]
      ) {
        return datapoints as DataPoint<T>[] || [];
    }
    return [];
  }
  return stream.aggregates[resolution] as DataPoint<T>[] || [];
};
