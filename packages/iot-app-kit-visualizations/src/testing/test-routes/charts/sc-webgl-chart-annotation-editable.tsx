import { Component, h, Listen, State } from '@stencil/core';
import { Annotations, ChartConfig, Threshold, YAnnotation } from '../../../components/charts/common/types';
import { COMPARISON_OPERATOR } from '../../../components/charts/common/constants';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

type WidgetUpdatedEvent = CustomEvent<Partial<ChartConfig>>;

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 2000,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 2000,
};

const Y_THRESHOLD: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 3800,
  label: {
    text: 'here is a y label',
    show: true,
  },
  showValue: true,
  color: 'blue',
  id: 'blue-threshold',
};

const Y_ANNOTATION: YAnnotation = {
  isEditable: true,
  value: 3200,
  label: {
    text: 'another y label',
    show: true,
  },
  showValue: true,
  color: 'green',
  id: 'green-anotation',
};

let oldAnnotations: Annotations | undefined;

@Component({
  tag: 'iot-app-kit-vis-webgl-chart-annotation-editable',
})
export class ScWebglChartAnnotationRescaling {
  @State() isEditableValue: boolean = false;
  @State() isShowValue: boolean = true;
  @State() annotations: Annotations | undefined = {
    x: [
      {
        value: new Date((X_MAX.getTime() + X_MIN.getTime()) / 2),
        label: {
          text: 'here is a x label',
          show: true,
        },
        showValue: true,
        color: 'purple',
      },
    ],
    y: [
      {
        ...Y_ANNOTATION,
        isEditable: !this.isEditableValue,
        showValue: this.isShowValue,
      },
      {
        ...Y_THRESHOLD,
        isEditable: !this.isEditableValue,
        showValue: !this.isShowValue,
      },
      {
        ...Y_ANNOTATION,
        isEditable: this.isEditableValue,
        value: 2300,
        color: 'red',
        showValue: this.isShowValue,
        id: 'red-annotation',
      },
    ],
  };

  @Listen('widgetUpdated')
  onWidgetUpdated({ detail: configUpdate }: WidgetUpdatedEvent) {
    this.annotations = configUpdate.annotations;
    oldAnnotations = this.annotations;
  }

  componentDidLoad() {
    oldAnnotations = this.annotations;
    setInterval(this.changeValue, 1000);
  }

  changeValue = () => {
    // this.annotations = oldAnnotations; //passed by reference so this doesn't work since draggable will modify oldAnnotations
    // this mimics the seperate annotation state of the app and the SC layer
    const { y } = this.annotations!;
    this.annotations = {
      ...this.annotations,
      y: (y as YAnnotation[]).map(annotation => {
        return {
          ...annotation,
          value: oldAnnotations!.y!.find(oldannotation => oldannotation.id === annotation.id)!.value,
        };
      }),
    };
  };

  onEditableChange = () => {
    const { y } = this.annotations!;
    this.annotations = {
      ...this.annotations,
      y: (y as YAnnotation[]).map(annotation => {
        return { ...annotation, isEditable: !annotation.isEditable };
      }),
    };
  };

  onShowValueChange = () => {
    const { y } = this.annotations!;
    this.annotations = {
      ...this.annotations,
      y: (y as YAnnotation[]).map(annotation => {
        return { ...annotation, showValue: !annotation.showValue };
      }),
    };
  };

  render() {
    return (
      <div class="synchro-chart-tests" style={{ width: '1000px', height: '1000px' }}>
        <div>
          <button id="change-editable" onClick={this.onEditableChange}>
            Change Editable
          </button>
        </div>
        <div>
          <button id="change-showvalue" onClick={this.onShowValueChange}>
            Change Show Value
          </button>
        </div>
        <div>
          <iot-app-kit-vis-line-chart
            widgetId="widget-id"
            dataStreams={[
              {
                id: 'test',
                color: 'black',
                name: 'test stream',
                data: [TEST_DATA_POINT, TEST_DATA_POINT_2],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
              {
                id: 'test2',
                color: 'orange',
                name: 'test stream2',
                data: [TEST_2_DATA_POINT, TEST_2_DATA_POINT_2],
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ]}
            annotations={this.annotations}
            viewport={{ start: X_MIN, end: X_MAX }}
            size={{
              height: 1000,
              width: 1000,
            }}
            setViewport={() => {}}
          />
          <iot-app-kit-vis-webgl-context />
        </div>
      </div>
    );
  }
}
