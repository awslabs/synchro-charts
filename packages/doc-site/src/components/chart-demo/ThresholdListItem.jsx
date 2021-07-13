import React from 'react';
import Button from "@awsui/components-react/button";

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
      <td style={{ display: 'flex', justifyContent: 'space-around'}}>
        <Button onClick={() => removeThreshold(thresholdId)}>
          Remove
        </Button>
      </td>
    </tr>
    </tbody>
  )
};

export default ThresholdListItem;
