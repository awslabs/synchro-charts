import { DataStream } from '../../utils/dataTypes';

/**
 * Line Chart Settings
 */

export const STROKE_WIDTH = 1.5;

export const getDataStreamForEventing = (dataStreams: DataStream[]): Omit<DataStream, 'data' | 'aggregates'>[] =>
  dataStreams.map(dataStream => ({
    id: dataStream.id,
    name: dataStream.name,
    detailedName: dataStream.detailedName,
    color: dataStream.color,
    unit: dataStream.unit,
    dataType: dataStream.dataType,
    streamType: dataStream.streamType,
    associatedStreams: dataStream.associatedStreams,
    isLoading: dataStream.isLoading,
    isRefreshing: dataStream.isRefreshing,
    error: dataStream.error,
    resolution: dataStream.resolution,
  }));
