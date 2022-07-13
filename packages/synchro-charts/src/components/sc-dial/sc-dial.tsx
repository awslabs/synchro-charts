import { Component, h, Prop } from '@stencil/core';
import { DataStream, MessageOverrides, MinimalViewPortConfig } from '../../utils/dataTypes';
import { Annotations, ChartConfig } from '../charts/common/types';
import { RenderCell } from '../sc-widget-grid/types';
import { validate } from '../common/validator/validate';

const renderCell: RenderCell = props => <sc-dial-base {...props} />;
@Component({
  tag: 'sc-dial',
  styleUrl: 'sc-dial.css',
  shadow: true,
})
export class ScDial implements ChartConfig {
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() widgetId!: string;
  @Prop() dataStreams!: DataStream[];
  @Prop() annotations: Annotations;
  @Prop() isEditing: boolean = false;
  @Prop() messageOverrides: MessageOverrides = {};

  componentWillRender() {
    validate(this);
  }

  render() {
    const { viewport, widgetId, dataStreams, annotations, isEditing, messageOverrides } = this;
    return (
      <sc-widget-grid
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
