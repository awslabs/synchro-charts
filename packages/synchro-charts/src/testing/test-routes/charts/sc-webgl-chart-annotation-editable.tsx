import { Component, h, State } from '@stencil/core';
import { Y_MAX, Y_MIN, X_MIN, X_MAX } from './constants';
import { Threshold, YAnnotation } from '../../../components/charts/common/types';
import { COMPARISON_OPERATOR } from '../../../components/charts/common/constants';

const Y_THRESHOLD: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 1400,
  label: {
    text: 'here is a y label',
    show: true,
  },
  showValue: true,
  color: 'blue',
};

const Y_ANNOTATION: YAnnotation = {
  isEditable: true,
  value: 2600,
  label: {
    text: 'another y label',
    show: true,
  },
  showValue: true,
  color: 'green',
};

@Component({
  tag: 'sc-webgl-chart-annotation-editable',
})
export class ScWebglChartAnnotationRescaling {
  @State() isEditableValue: boolean = false;

  onEditableChange = () => {
    this.isEditableValue = !this.isEditableValue;
  };

  render() {
    return (
      <div style={{ width: '1000px', height: '1000px' }}>
        <div>
          <button id="changeEditable" onClick={this.onEditableChange}>
            Change Editable
          </button>
        </div>
        <div>
          <sc-line-chart
            widgetId="widget-id"
            dataStreams={[]}
            annotations={{
              x: [
                {
                  value: new Date((X_MAX.getTime() + X_MIN.getTime()) / 2),
                  label: {
                    text: 'here is a x label',
                    show: true,
                  },
                  showValue: true,
                  color: 'red',
                },
              ],
              y: [
                { ...Y_ANNOTATION, isEditable: !this.isEditableValue },
                { ...Y_THRESHOLD, isEditable: !this.isEditableValue },
                {
                  ...Y_ANNOTATION,
                  isEditable: this.isEditableValue,
                  value: 2300,
                  color: 'red',
                },
              ],
            }}
            viewport={{ start: X_MIN, end: X_MAX}}
            size={{
              height: 1000,
              width: 1000,
            }}
          />
          <sc-webgl-context />
        </div>
      </div>
    );
  }
}
