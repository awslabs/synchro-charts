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
  const { color, value, comparisonOperator, isEditable, label } = threshold;

  const annotationLabel = label ? label.text : '';

  return (
    <tbody>
    <tr key={`${threshold.value}---${threshold.label}`} className="threshold-list-item-container">
      <td className="color-container">
        <div className="color-block" style={{background: color}}/>
      </td>
      <td>{value}</td>
      <td>{COMPARATOR_MAP[comparisonOperator]}</td>
      <td>{isEditable.toString()}</td>
      <td>{annotationLabel}</td>
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
