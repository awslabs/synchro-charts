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
const size = {
  ...SIZE,
  width,
  height,
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
      <div>
        <div style={{ width: `${width}px`, height: `${height}px` }}>
          <this.component
            widgetId="some-widget-id"
            dataStreams={dataStreams}
            isEditing={isEditing}
            alarms={alarms}
            viewPort={viewPort}
            legend={legend}
            size={size}
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
        </div>
        <sc-webgl-context />
      </div>
    );
  }
}
