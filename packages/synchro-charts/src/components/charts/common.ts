import { DataStream } from '../../utils/dataTypes';

/**
 * Line Chart Settings
 */

export const STROKE_WIDTH = 1.5;
export const POINT_RADIUS = 2;
export const FIRST_POINT_RADIUS = POINT_RADIUS * 2;

export const getDataStreamForEventing = (dataStreams: DataStream[]): Omit<DataStream, 'data' | 'aggregates'>[] => {
  return dataStreams.map(dataStream => {
    return {
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
    };
  });
};
