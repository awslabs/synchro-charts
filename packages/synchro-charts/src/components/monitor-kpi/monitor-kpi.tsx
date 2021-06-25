import { Component, h, Prop } from '@stencil/core';

import { DataStream, MessageOverrides, MinimalViewPortConfig } from '../../utils/dataTypes';
import { RenderCell } from '../sc-widget-grid/types';
import { Annotations, ChartConfig } from '../charts/common/types';

const MSG =
  'This visualization displays only live data. Choose a live time frame to display data in this visualization.';

const renderCell: RenderCell = props => <monitor-kpi-base {...props} />;

@Component({
  tag: 'monitor-kpi',
  styleUrl: 'monitor-kpi.css',
  shadow: false,
})
export class MonitorKpi implements ChartConfig {
  @Prop() viewPort: MinimalViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() annotations: Annotations;
  @Prop() liveModeOnlyMessage: string = MSG;
  @Prop() isEditing: boolean = false;
  @Prop() messageOverrides: MessageOverrides = {};

  render() {
    const { viewPort, widgetId, dataStreams, annotations, liveModeOnlyMessage, isEditing, messageOverrides } = this;
    return (
      <monitor-widget-grid
        viewPort={viewPort}
        widgetId={widgetId}
        dataStreams={dataStreams}
        annotations={annotations}
        liveModeOnlyMessage={liveModeOnlyMessage}
        isEditing={isEditing}
        messageOverrides={messageOverrides}
        renderCell={renderCell}
      />
    );
  }
}
