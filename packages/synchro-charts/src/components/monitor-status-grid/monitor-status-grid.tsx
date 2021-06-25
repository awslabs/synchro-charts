import { Component, h, Prop } from '@stencil/core';

import { DataStream, MessageOverrides, MinimalViewPortConfig } from '../../utils/dataTypes';
import { Annotations, ChartConfig } from '../charts/common/types';
import { LabelsConfig } from '../common/types';
import { CellOptions, RenderCell } from '../sc-widget-grid/types';

const DEFAULT_LABELS_CONFIG: Required<LabelsConfig> = {
  showUnit: true,
  showName: true,
  showValue: true,
};

const renderCell: RenderCell = ({ labelsConfig, ...rest }: CellOptions) => (
  <monitor-status-cell labelsConfig={{ ...DEFAULT_LABELS_CONFIG, ...labelsConfig }} {...rest} />
);

const MSG =
  'This visualization displays only live data. Choose a live time frame to display data in this visualization.';

@Component({
  tag: 'monitor-status-grid',
  shadow: false,
})
export class MonitorStatusGrid implements ChartConfig {
  /** Status Grid Specific configuration */
  @Prop() labelsConfig: LabelsConfig;
  @Prop() viewPort: MinimalViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() annotations: Annotations;
  @Prop() liveModeOnlyMessage: string = MSG;
  @Prop() isEditing: boolean = false;
  @Prop() messageOverrides: MessageOverrides = {};

  render() {
    const {
      viewPort,
      widgetId,
      dataStreams,
      annotations,
      liveModeOnlyMessage,
      isEditing,
      messageOverrides,
      labelsConfig,
    } = this;
    return (
      <monitor-widget-grid
        labelsConfig={labelsConfig}
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
