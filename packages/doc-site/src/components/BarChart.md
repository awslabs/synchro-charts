```jsx
<div style={{ width: '100%', height: '500px' }}>
  <BarChart
    widgetId="widget-id"
    viewPort={{
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
    }}
    legend= {{
      width: 100,
      position: 'BOTTOM',
    }}
    dataStreams={[
      {
        id: 'car-count',
        dataType: 'NUMBER',
        color: '#0073bb',
        name: 'Car Count',
        resolution: 1000 * 60 * 60 * 24 * 30, // one month
        aggregates: {
          [1000 * 60 * 60 * 24 * 30]: [{
            x: new Date(2000, 0, 0).getTime(),
            y: 10,
          }, {
            x: new Date(2000, 3, 0).getTime(),
            y: 20,
          }, {
            x: new Date(2000, 6, 0).getTime(),
            y: 50,
          }, {
            x: new Date(2000, 9, 0).getTime(),
            y: 35,
          }, {
            x: new Date(2001, 0, 0).getTime(),
            y: 15,
          }]
        },
      }, {
        id: 'boat-count',
        dataType: 'NUMBER',
        color: '#dd6b10',
        name: 'Boat Count',
        resolution: 1000 * 60 * 60 * 24 * 30, // one month
        aggregates: {
          [1000 * 60 * 60 * 24 * 30]: [{
            x: new Date(2000, 0, 0).getTime(),
            y: 8,
          }, {
            x: new Date(2000, 3, 0).getTime(),
            y: 15,
          }, {
            x: new Date(2000, 6, 0).getTime(),
            y: 45,
          }, {
            x: new Date(2000, 9, 0).getTime(),
            y: 10,
          }, {
            x: new Date(2001, 0, 0).getTime(),
            y: 100,
          }]
        },
      }]}
    />
</div>
```

### Bar chart with alarms
 
You can show the current latest alarm status on the legend through setting the `icon` property for the threshold.

Learn how to display the alarms value as a threshold [here](/#section-threshold)
```jsx
import { DataType, COMPARISON_OPERATOR, StatusIcon } from '@synchro-charts/core';
<div style={{ width: '100%', height: '500px' }}>
  <BarChart
    widgetId="widget-id"
    viewPort={{
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
    }}
    legend= {{
      width: 100,
      position: 'BOTTOM',
    }}
    dataStreams={[
      {
        id: 'car-count',
        dataType: 'NUMBER',
        color: '#0073bb',
        name: 'Car Count',
        resolution: 1000 * 60 * 60 * 24 * 30, // one month
        aggregates: {
          [1000 * 60 * 60 * 24 * 30]: [{
            x: new Date(2000, 0, 0).getTime(),
            y: 10,
          }, {
            x: new Date(2000, 3, 0).getTime(),
            y: 20,
          }, {
            x: new Date(2000, 6, 0).getTime(),
            y: 50,
          }, {
            x: new Date(2000, 9, 0).getTime(),
            y: 35,
          }, {
            x: new Date(2001, 0, 0).getTime(),
            y: 15,
          }]
        },
      }, {
        id: 'boat-count',
        dataType: 'NUMBER',
        color: '#dd6b10',
        name: 'Boat Count',
        resolution: 1000 * 60 * 60 * 24 * 30, // one month
        aggregates: {
          [1000 * 60 * 60 * 24 * 30]: [{
            x: new Date(2000, 0, 0).getTime(),
            y: 8,
          }, {
            x: new Date(2000, 3, 0).getTime(),
            y: 15,
          }, {
            x: new Date(2000, 6, 0).getTime(),
            y: 45,
          }, {
            x: new Date(2000, 9, 0).getTime(),
            y: 10,
          }, {
            x: new Date(2001, 0, 0).getTime(),
            y: 100,
          }]
        },
      }]}
    annotations={{
      y: [
        {
          color: '#d13212',
          value: 90,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
          icon: StatusIcon.ACTIVE,
          showValue: true,
        }],
    }}
    />
</div>
```

