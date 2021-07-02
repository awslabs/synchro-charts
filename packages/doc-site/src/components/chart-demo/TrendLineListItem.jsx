import React from 'react';

const TrendLineListItem = ({
  dataStreamName,
  trend,
  removeTrendLine,
}) => {
  return (
    <tbody>
    <tr key={`${trend.dataStreamId}---${trend.type}`} className="trend-line-list-item-container">
      <td className="color-container">
        <div className="color-block" style={{ background: trend.color }} />
      </td>
      <td>{dataStreamName}</td>
      <td>
        <button onClick={() => removeTrendLine(trend.dataStreamId, trend.type)}>
          <strong>X</strong>
        </button>
      </td>
    </tr>
    </tbody>
  );
};

export default TrendLineListItem;
