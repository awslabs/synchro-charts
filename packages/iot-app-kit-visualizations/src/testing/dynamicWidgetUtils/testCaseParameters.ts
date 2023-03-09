import * as queryString from 'query-string';
import { LEGEND } from './constants';
import { AlarmsConfig, DataStream, DataStreamInfo, MessageOverrides, TableColumn } from '../../utils/dataTypes';
import { Annotations, Axis, LegendConfig, XAnnotation } from '../../components/charts/common/types';

export type SearchQueryParams = {
  alarms?: AlarmsConfig;
  messageOverrides?: MessageOverrides;
  width?: number | string;
  axis?: Axis.Options;
  height?: number | string;
  duration?: number;
  errMsg: string;
  viewportStart: Date;
  viewportEnd: Date;
  componentTag: string;
  legend: LegendConfig;
  isEditing: boolean;
  gestures: boolean;
  dataStreamInfos: DataStreamInfo[];
  annotations?: Annotations;
  tableColumns: TableColumn[];
  dataStreams: DataStream[];

  // Data returned asynchronously through `onRequestData`
  asyncDataStreams: DataStream[];

  // Effect the time period before `onRequestData` will make the request as complete. Allows tests of
  // simulated asynchronous workflows
  delayBeforeDataLoads: number; // ms

  // If true, `onRequestData` will register an error.
  hasError: boolean;

  // Whether to display the info names - useful for tests involve editing inputs
  displayInfoNames: boolean;
};

const parseBool = (str: string): boolean => str === 'true';

const deserializeAnnotations = (str: string): Annotations => {
  const annotations = JSON.parse(str) as Annotations;
  const { x } = annotations;

  const deserializeXAnnotation = (xAnnotation: XAnnotation): XAnnotation => ({
    ...xAnnotation,
    value: new Date(xAnnotation.value),
  });

  return {
    ...annotations,
    x: x != null ? x.map(deserializeXAnnotation) : undefined,
  };
};

export const SCREEN_SIZE = {
  width: 700,
  height: 450,
};

export const constructSearchQuery = ({
  viewportStart,
  viewportEnd,
  dataStreams,
  asyncDataStreams,
  alarms,
  dataStreamInfos,
  legend,
  tableColumns,
  annotations,
  messageOverrides,
  axis,
  width,
  height,
  // Props that can be directly serialized, i.e. numbers, booleans, and strings
  ...serializableProps
}: Partial<SearchQueryParams>): string =>
  queryString.stringify({
    // manually serialize fields that require it.
    annotations: annotations && JSON.stringify(annotations),
    legend: legend && JSON.stringify(legend),
    dataStreamInfos: dataStreamInfos && JSON.stringify(dataStreamInfos),
    dataStreams: dataStreams && JSON.stringify(dataStreams),
    asyncDataStreams: asyncDataStreams && JSON.stringify(asyncDataStreams),
    alarms: alarms && JSON.stringify(alarms),
    viewportStart: viewportStart && viewportStart.toISOString(),
    viewportEnd: viewportEnd && viewportEnd.toISOString(),
    tableColumns: tableColumns && JSON.stringify(tableColumns),
    messageOverrides: messageOverrides && JSON.stringify(messageOverrides),
    axis: axis && JSON.stringify(axis),
    width: width && JSON.stringify(width),
    height: height && JSON.stringify(height),
    // For the rest, we don't have to do any work! and doing less is better
    ...serializableProps,
  });

const deserializeDataStream = (almostDataStream: any): DataStream =>
  ({
    ...almostDataStream,
    data: almostDataStream.data.map((point: any) => ({ x: Number(point.x), y: point.y })),
  } as DataStream);

export const testCaseParameters = (): SearchQueryParams => {
  const query = queryString.parse(window.location.search) as any;

  // Instructions for extending: default should be undefined, or if required, some empty state.
  // DO NOT send mock data here! it should be the bare minimum to render. Consider this the default empty state.
  return {
    alarms: query.alarms ? JSON.parse(query.alarms) : undefined,
    width: query.width ? JSON.parse(query.width) : undefined,
    axis: query.axis ? JSON.parse(query.axis) : undefined,
    height: query.height ? JSON.parse(query.height) : undefined,
    duration: query.duration ? JSON.parse(query.duration) : undefined,
    errMsg: query.errMsg,
    gestures: query.gestures != null ? parseBool(query.gestures) : true,
    delayBeforeDataLoads: query.delayBeforeDataLoads != null ? JSON.parse(query.delayBeforeDataLoads) : 0,
    dataStreamInfos: query.dataStreamInfos != null ? JSON.parse(query.dataStreamInfos) : [],
    tableColumns: query.tableColumns != null ? JSON.parse(query.tableColumns) : [],
    legend: query.legend != null ? JSON.parse(query.legend) : LEGEND, // set this to undefined
    messageOverrides: query.messageOverrides != null ? JSON.parse(query.messageOverrides) : undefined,
    componentTag: query.componentTag != null ? query.componentTag : 'iot-app-kit-vis-line-chart',
    // deserialize fields that require it.
    displayInfoNames: query.displayInfoNames ? parseBool(query.displayInfoNames) : false,
    annotations: query.annotations != null ? deserializeAnnotations(query.annotations) : undefined,
    isEditing: query.isEditing != null ? parseBool(query.isEditing) : false,
    hasError: query.hasError != null ? parseBool(query.hasError) : false,
    dataStreams: query.dataStreams != null ? JSON.parse(query.dataStreams).map(deserializeDataStream) : [],
    asyncDataStreams:
      query.asyncDataStreams != null ? JSON.parse(query.asyncDataStreams).map(deserializeDataStream) : [],
    viewportStart: query.viewportStart != null ? new Date(query.viewportStart) : new Date(2000, 0, 0),
    viewportEnd: query.viewportEnd != null ? new Date(query.viewportEnd) : new Date(2000, 0, 1),
  };
};
