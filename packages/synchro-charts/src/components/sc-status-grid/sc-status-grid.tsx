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
  <sc-status-cell labelsConfig={{ ...DEFAULT_LABELS_CONFIG, ...labelsConfig }} {...rest} />
);

@Component({
  tag: 'sc-status-grid',
  shadow: false,
})
export class ScStatusGrid implements ChartConfig {
  /** Status Grid Specific configuration */
  @Prop() labelsConfig: LabelsConfig;
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() annotations: Annotations;
  @Prop() isEditing: boolean = false;
  @Prop() messageOverrides: MessageOverrides = {};

  render() {
    const { viewport, widgetId, dataStreams, annotations, isEditing, messageOverrides, labelsConfig } = this;
    return (
      <sc-widget-grid
        labelsConfig={labelsConfig}
        viewport={viewport}
        widgetId={widgetId}
        dataStreams={dataStreams}
        annotations={annotations}
        isEditing={isEditing}
        messageOverrides={messageOverrides}
        renderCell={renderCell}
      />
    );
  }
}
