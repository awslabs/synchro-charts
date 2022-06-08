import { AggregateType, DataPoint, DataStream, Primitive, Resolution } from './dataTypes';

/**
 * Get the points for a given resolution (and an optional aggregate type) from a data stream
 */
 export const getDataPoints = <T extends Primitive>(stream: DataStream<T>, resolution: Resolution, aggregateType?: AggregateType): DataPoint<T>[] => {
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
  if (!aggregateType && stream.aggregates[resolution] != null) {
    const datapoints = stream.aggregates[resolution];

    if (datapoints != null && !Array.isArray(datapoints) && datapoints.average != null) {
      return datapoints.average;
    }

    if (datapoints != null && Array.isArray(datapoints)) {
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

    if (datapoints != null && Array.isArray(datapoints)) {
        return datapoints as DataPoint<T>[] || [];
    }
    return [];
  }

  return stream.aggregates[resolution] as DataPoint<T>[] || [];
};
