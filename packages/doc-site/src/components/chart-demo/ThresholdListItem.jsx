import React from 'react';

const COMPARATOR_MAP = {
  GTE: '>=',
  GT: '>',
  LTE: '<=',
  LT: '<',
  EQ: '=',
};

const ThresholdListItem = ({threshold, removeThreshold, thresholdId}) => {
  const { color, value, comparisonOperator } = threshold;

  return (
    <tbody>
    <tr key={`${threshold.value}---${threshold.comparisonOperator}`} className="threshold-list-item-container">
      <td className="color-container">
        <div className="color-block" style={{background: color}}/>
      </td>
      <td>{value}</td>
      <td>{COMPARATOR_MAP[comparisonOperator]}</td>
      <td>
        <button onClick={() => removeThreshold(thresholdId)}>
          <strong>X</strong>
        </button>
      </td>
    </tr>
    </tbody>
  )
};

export default ThresholdListItem;
