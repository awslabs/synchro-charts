import { h } from '@stencil/core';
import { round } from '../../utils/number';
import { Primitive } from '../../utils/dataTypes';
import { NO_VALUE_PRESENT } from '../common/terms';

/**
 * Display value of a data point, supports all data types
 */
export const Value = ({
  isEnabled = true,
  value,
  unit,
  precision,
}: {
  isEnabled?: boolean;
  value?: Primitive;
  unit?: string;
  precision?: number;
}) => {
  if (!isEnabled || value == null) {
    return <span data-testid="no-value-present">{NO_VALUE_PRESENT}</span>;
  }

  if (typeof value === 'number') {
    /** Display Number */
    return [round(value, precision), unit && <span class="unit"> {unit}</span>];
  }

  /** Display String or Booleans */
  return [String(value), unit && <span class="unit"> {unit}</span>];
};
