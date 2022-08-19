import { Component, h, Listen, Prop } from '@stencil/core';
import { SIZE, VIEWPORT as DEFAULT_VIEWPORT } from '../dynamicWidgetUtils/constants';
import { testCaseParameters } from '../dynamicWidgetUtils/testCaseParameters';
import { DataStreamInfo } from '../../utils/dataTypes';
import { DialSizeConfig } from '../../components/sc-dial/type';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 400;

const {
  /** Chart configurations */
  alarms,
  messageOverrides,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  size,
  axis,
  componentTag,
  annotations,
  viewportStart,
  viewportEnd,
  duration,
  isEditing,
  associatedStreams,
  dataStream,
  dataStreams,
  gestures,
  legend,
  tableColumns,
  yMin,
  yMax,
} = testCaseParameters();

const getSize = (
  value: number | string
): { height: number | string; width: number | string } | DialSizeConfig | undefined => {
  if (typeof value === 'string') {
    return undefined;
  }
  return {
    ...SIZE,
    width,
    height,
    ...size,
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
    const viewport = {
      ...DEFAULT_VIEWPORT,
      yMin,
      yMax,
      start: viewportStart,
      end: viewportEnd,
      duration,
      group: 'some-viewport-group',
    };

    // live mode
    if (duration != null) {
      delete viewport.start;
      delete viewport.end;
    }

    return (
      <div style={{ width: styleSize(width), height: styleSize(height) }}>
        <this.component
          widgetId="some-widget-id"
          associatedStreams={associatedStreams}
          dataStream={dataStream}
          dataStreams={dataStreams}
          isEditing={isEditing}
          alarms={alarms}
          viewport={viewport}
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
          liveModeOnly="invalidWidgetForHistoricalData.content"
        />
        <sc-webgl-context />
      </div>
    );
  }
}
