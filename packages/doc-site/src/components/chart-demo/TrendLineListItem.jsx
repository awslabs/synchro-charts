import React from 'react';
import Button from "@awsui/components-react/button";

const TrendLineListItem = ({
  dataStreamName,
  trend,
  removeTrendLine,
}) => {
  return (
    <tbody>
    <tr key={`${trend.dataStreamId}---${trend.type}`} className="trend-line-list-item-container">
      <td className="color-container" style={{ paddingLeft: '11px' }}>
        <div className="color-block" style={{ background: trend.color }} />
      </td>
      <td style={{ paddingLeft: '22px' }}>{dataStreamName}</td>
      <td style={{ display: 'flex', justifyContent: 'space-around'}}>
        <Button onClick={() => removeTrendLine(trend.dataStreamId, trend.type)}>
          Remove
        </Button>
      </td>
    </tr>
    </tbody>
  );
};

export default TrendLineListItem;
