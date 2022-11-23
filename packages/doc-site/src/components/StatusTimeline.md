```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR, StreamType } from '@synchro-charts/core';
const MONTH_RESOLUTION = 1000 * 60 * 60 * 24 * 30; // one month
<div style={{ width: '100%', height: '300px' }}>
  <StatusTimeline
    alarms={{expires: undefined}}
    dataStreams={[
      {
        id: 'car-speed-alarm',
        name: 'Car speed',
        aggregates: {
          [MONTH_RESOLUTION]: [{
            x: new Date(2000, 0, 0).getTime(),
            y: 'Normal',
          }, {
            x: new Date(2000, 3, 0).getTime(),
            y: 'Warning',
          }, {
            x: new Date(2000, 6, 0).getTime(),
            y: 'Critical',
          }, {
            x: new Date(2000, 9, 0).getTime(),
            y: 'Warning',
          }, {
            x: new Date(2000, 9, 15).getTime(),
            y: 'Normal',
          }]
        },
        resolution: 1000 * 60 * 60 * 24 * 30, // one month
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#d13212',
        value: 'Critical',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      }, {
        color: '#ff9900',
        value: 'Warning',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      }, {
        color: '#1d8102',
        value: 'Normal',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      }],
    }}
    legend= {{
      width: 100,
      position: LEGEND_POSITION.BOTTOM,
    }}
    viewport={{ yMin: 0, yMax: 100, start: new Date(1999, 0, 0), end: new Date(2001, 6, 0) }}
  />
</div>
```

> **Supported data type(s): Number, String, Boolean** 
> (alarm streams excluded) 

Each bar in the status timeline represents a period of the time that the associated data point that is active. 

The color of the bar is determined by the threshold that is considered breached by the data point. If no data is breaching
the threshold, the default color is grey.

If there is no data point in a given point in time, the chart will display grey stripe to indicate no value.

Below is an example of utilizing the following threshold to color the status timeline.
Note that also the threshold rules will be used to determine the legend.

```jsx static
  annotations={{
    y: [{
      color: '#d13212',
      value: 'Critical',
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    }, {
      color: '#ff9900',
      value: 'Warning',
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    }, {
      color: '#1d8102',
      value: 'Normal',
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    }],
  }}
```



### Configuring status expiration
The status timeline allows customization of how long a data point is considered active. 
This is achieved by providing an alarms object with `expires` property in milliseconds.

In the first example above we demonstrate a case where status never expires, i.e. when `expires` is `undefined`.
If a data point has a given value associated with no expiration, then the data point is considered active until a new data point occurs.

However, if we want to have a data point to be considered active for a set period of a time, we can provide the alarm's `expires` in milliseconds.
In this case, the data is considered expired, when either the point in time is further away from the expired time, or a new data point occurs.

Below is an example of one month expiration,

```jsx static
alarms={{ expires: 1000 * 60 * 60 * 24 * 30 }}
```

```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR, StreamType } from '@synchro-charts/core';
const MONTH_RESOLUTION = 1000 * 60 * 60 * 24 * 30; // one month
<div style={{ width: '100%', height: '300px' }}>
  <StatusTimeline
    alarms={{expires: 1000 * 60 * 60 * 24 * 30 }}
    dataStreams={[
      {
        id: 'car-speed-alarm',
        name: 'Car speed',
        aggregates: {
          [MONTH_RESOLUTION]: [{
            x: new Date(2000, 0, 0).getTime(),
            y: 'Normal',
          }, {
            x: new Date(2000, 3, 0).getTime(),
            y: 'Warning',
          }, {
            x: new Date(2000, 6, 0).getTime(),
            y: 'Critical',
          }, {
            x: new Date(2000, 9, 0).getTime(),
            y: 'Warning',
          }, {
            x: new Date(2000, 9, 15).getTime(0),
            y: 'Normal',
          }]
        },
        resolution: 1000 * 60 * 60 * 24 * 30, // one month
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#d13212',
        value: 'Critical',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      }, {
        color: '#ff9900',
        value: 'Warning',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      }, {
        color: '#1d8102',
        value: 'Normal',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      }],
    }}
    legend= {{
      width: 100,
      position: LEGEND_POSITION.BOTTOM,
    }}
    viewport={{ yMin: 0, yMax: 100, start: new Date(1999, 0, 0), end: new Date(2001, 6, 0) }}
  />
</div>
```

**Note**: This component requires a WebGL context to be initialized. Read more about how to set that up in the [WebGL context documentation]( https://synchrocharts.com//#/WebGL%20context )
