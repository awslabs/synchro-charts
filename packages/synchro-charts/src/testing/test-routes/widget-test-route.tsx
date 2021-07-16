import { Component, h, Listen, Prop } from '@stencil/core';
import { SIZE, VIEW_PORT as DEFAULT_VIEW_PORT } from '../dynamicWidgetUtils/constants';
import { testCaseParameters } from '../dynamicWidgetUtils/testCaseParameters';
import { DataStreamInfo } from '../../utils/dataTypes';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 400;

const {
  /** Chart configurations */
  alarms,
  messageOverrides,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  axis,
  componentTag,
  annotations,
  viewPortStart,
  viewPortEnd,
  duration,
  isEditing,
  dataStreams,
  gestures,
  legend,
  tableColumns,
} = testCaseParameters();

const viewPort = {
  ...DEFAULT_VIEW_PORT,
  start: viewPortStart,
  end: viewPortEnd,
  duration,
  group: 'some-viewport-group',
};

const getSize = (value: number | string): { height: number | string; width: number | string } | undefined => {
  if (typeof value === 'string') {
    return undefined;
  }
  return {
    ...SIZE,
    width,
    height,
  };
};

const styleSize = (value: number | string): string => {
  if (typeof value === 'string') {
    return value;
  }
  return `${value}px`;
};

@Component({
  tag: 'widget-test-route',
})
export class WidgetTestRoute {
  @Prop() dataStreamInfos: DataStreamInfo[] = [];
  @Prop() component: string = componentTag;

  @Listen('widgetUpdated')
  onWidgetUpdated({ detail: configUpdate }: CustomEvent) {
    if (configUpdate.dataStreamInfo) {
      this.dataStreamInfos = configUpdate.dataStreamInfo;
    }
  }

  render() {
    return (
      <div style={{ width: styleSize(width), height: styleSize(height) }}>
        <this.component
          widgetId="some-widget-id"
          dataStreams={dataStreams}
          isEditing={isEditing}
          alarms={alarms}
          viewPort={viewPort}
          legend={legend}
          size={getSize(width)}
          axis={axis}
          tableColumns={tableColumns}
          annotations={annotations}
          gestures={gestures}
          messageOverrides={messageOverrides}
          /** TODO: Port these over to the message overrides */
          invalidTagErrorHeader="invalidComponentTag.header"
          invalidTagErrorSubheader="invalidComponentTag.subheader"
          liveModeOnlyMessage="invalidWidgetForHistoricalData.content"
        />
        <sc-webgl-context />
      </div>
    );
  }
}
