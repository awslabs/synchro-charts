import uniqBy from 'lodash.uniqby';
import { Component, h, Prop } from '@stencil/core';
import { Threshold } from '../../common/types';
import { COMPARISON_OPERATOR } from '../../common/constants';

const COMPARISON_SYMBOL: { [operator: string]: string } = {
  [COMPARISON_OPERATOR.EQUAL]: '=',
  [COMPARISON_OPERATOR.LESS_THAN]: '<',
  [COMPARISON_OPERATOR.LESS_THAN_EQUAL]: '<=',
  [COMPARISON_OPERATOR.GREATER_THAN]: '>',
  [COMPARISON_OPERATOR.GREATER_THAN_EQUAL]: '>=',
};

const label = (threshold: Threshold): string => {
  if (threshold.comparisonOperator === COMPARISON_OPERATOR.EQUAL) {
    return String(threshold.value);
  }

  return `y ${COMPARISON_SYMBOL[threshold.comparisonOperator]} ${threshold.value}`;
};

// a key constructed to serialize all of the fields which a row depends on.
// If this key is not unique, duplicates may be rendered within the `threshold-legend`
const key = ({ value, comparisonOperator, color }: Threshold): string => `${value}-${comparisonOperator}-${color}`;

@Component({
  tag: 'iot-app-kit-vis-threshold-legend',
  styleUrl: 'sc-threshold-legend.css',
  shadow: false,
})
export class ScThresholdLegend {
  @Prop() thresholds!: Threshold[];

  // We do not want to draw multiple 'legend rows' of identical color/label
  uniqueThresholds(): Threshold[] {
    // NOTE: maintains order of thresholds
    return uniqBy(this.thresholds, key);
  }

  render() {
    return this.uniqueThresholds().map(threshold => (
      <iot-app-kit-vis-threshold-legend-row key={key(threshold)} color={threshold.color} label={label(threshold)} />
    ));
  }
}
