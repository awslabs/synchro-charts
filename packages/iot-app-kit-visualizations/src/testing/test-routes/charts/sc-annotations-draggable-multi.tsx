import { Component, h } from '@stencil/core';
import { Annotations } from '../../../components/charts/common/types';

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);

const ANNOTATIONS: Annotations | undefined = {
  y: [
    {
      id: 'annotation-1',
      color: 'red',
      isEditable: true,
      showValue: true,
      value: 1000,
      label: {
        text: 'annotation-1',
        show: true,
      },
    },
    {
      id: 'annotation-2',
      color: 'blue',
      isEditable: true,
      showValue: true,
      value: 0,
      label: {
        text: 'annotation-2',
        show: true,
      },
    },
  ],
};

const SIZE = {
  height: 340,
  width: 340,
};

@Component({
  tag: 'sc-annotations-draggable-multi',
})
export class ScAnnotationsDraggableMulti {
  render() {
    return (
      <div>
        <div style={{ width: '500px', height: '500px' }}>
          <sc-line-chart
            widgetId="widget-id"
            dataStreams={[]}
            annotations={ANNOTATIONS}
            size={SIZE}
            viewport={{ start: X_MIN, end: X_MAX }}
          />
        </div>
        <div style={{ width: '500px', height: '500px' }}>
          <sc-line-chart
            widgetId="widget-id-2"
            dataStreams={[]}
            annotations={ANNOTATIONS}
            size={SIZE}
            viewport={{ start: X_MIN, end: X_MAX }}
          />
        </div>
        <sc-webgl-context />
      </div>
    );
  }
}
