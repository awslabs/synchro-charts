```jsx
const MONTH_RESOLUTION = 1000 * 60 * 60 * 24 * 30; // one month
<div style={{ width: '100%', height: '500px' }}>
  <ScatterChart
    widgetId="widget-id"
    viewPort={{
      start: new Date(1999, 11, 0),
      end: new Date(2001, 2, 0),
    }}
    legend= {{
      width: 100,
      position: 'BOTTOM',
    }}
    dataStreams={[
      {
        id: 'car-count',
        dataType: 'NUMBER',
        resolution: MONTH_RESOLUTION,
        name: 'Car Count',
        color: '#0073bb',
        aggregates: {
          [MONTH_RESOLUTION]: [
            {
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
            }
          ]
        },
      },
      {
        id: 'boat-count',
        dataType: 'NUMBER',
        name: 'Boat Count',
        color: '#dd6b10',
        resolution: MONTH_RESOLUTION,
        aggregates: {
          [MONTH_RESOLUTION]: [{
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
### Scatter chart with alarm

You can show the current latest alarm status on the legend through setting the `icon` property for the threshold.

Learn how to display the alarms value as a threshold [here](/#section-threshold)
```jsx
import { DataType, COMPARISON_OPERATOR, StatusIcon } from '@synchro-charts/core';
const MONTH_RESOLUTION = 1000 * 60 * 60 * 24 * 30; // one month
<div style={{ width: '100%', height: '500px' }}>
  <ScatterChart
    widgetId="widget-id"
    viewPort={{
        start: new Date(1999, 11, 0),
        end: new Date(2001, 2, 0),
    }}
    legend= {{
      width: 100,
      position: 'BOTTOM',
    }}
    dataStreams={[
      {
        id: 'car-count',
        dataType: 'NUMBER',
        resolution: MONTH_RESOLUTION,
        color: '#0073bb',
        name: 'Car Count',
        aggregates: {
          [MONTH_RESOLUTION]: [
            {
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
            }
          ]
        },
      },
      {
        id: 'boat-count',
        dataType: 'NUMBER',
        color: '#dd6b10',
        name: 'Boat Count',
        resolution: MONTH_RESOLUTION,
        aggregates: {
          [MONTH_RESOLUTION]: [{
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

**Note**: This component requires a WebGL context to be initialized. Read more about how to set that up in the [WebGL context documentation]( https://synchrocharts.com//#/WebGL%20context )
