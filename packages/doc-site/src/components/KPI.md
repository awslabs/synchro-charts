```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR, StreamType, StatusIcon } from '@synchro-charts/core';
<div style={{ width: '100%', height: '100%' }}>
  <KPI
    dataStreams={[
      {
        id: 'wind-temperature',
        name: 'Wind temperature',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 10,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperature-with-trends',
        name: 'Wind temperature trends',
        data: [{
          x: new Date(2000, 11, 0).getTime(),
          y: 10,
        }, {
          x: new Date(2001, 0, 0).getTime(),
          y: 15,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed',
        name: 'Car speed alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 50,
        }],
        unit: 'MPH',
        resolution: 0,
        associatedStreams: [{
          id:'car-speed-alarm',
          type: StreamType.ALARM,
        }],
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-alarm',
        name: 'Car speed alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'Warning',
        }],
        resolution: 0,
        streamType: StreamType.ALARM,
        dataType: DataType.STRING,
      }
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#1d8102',
        value: 15,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#ff9900',
        value: 'Warning',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        dataStreamIds: ['car-speed-alarm'],
        icon: StatusIcon.LATCHED,
      }],
    }}
    viewport={{ duration: 1000 }}
  />
</div>
```

> **Supported data type(s): Number, String, Boolean** 
> (alarm streams excluded) 

Key Performance Indicator (KPI) visualizes the latest value from a data stream by emphasizing the property value.
For data stream of type `NUMBER` it will also display the trending percentage by using the two most recent data points.

Below is an example of a single data stream. When it is displaying only one data stream, it will put more emphasis on
title and the value.
```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR } from '@synchro-charts/core';

<div style={{ width: '100%', height: '100%' }}>
  <KPI
    dataStreams={[
      {
        id: 'wind-temperature',
        name: 'Wind temperature',
        data: [{
          x: new Date(2001, 0, 0),
          y: 10,
        }],
        unit: 'C',
        color: 'black',
        resolution: 0,
        dataType: DataType.NUMBER,
      }
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#1d8102',
        value: 15,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#ff9900',
        value: 'Warning',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        dataStreamIds: ['car-speed-alarm']
      }],
    }}
    viewport={{ duration: 1000 }}
  />
</div>
```

### KPI with trends
```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR } from '@synchro-charts/core';
<div style={{ width: '100%', height: '100%' }}>
  <KPI
    dataStreams={[
      {
        id: 'wind-temperature-with-trends',
        name: 'Wind temperature trends',
        data: [{
          x: new Date(2000, 11, 0).getTime(),
          y: 10,
        }, {
          x: new Date(2001, 0, 0).getTime(),
          y: 15,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#1d8102',
        value: 15,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#ff9900',
        value: 'Warning',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      }],
    }}
    viewport={{ duration: 1000 }}
  />
</div>
```

### Visualizing alarm on KPI

When paired with an alarm data stream, the KPI component will combine it with the regular data stream and visualize
the latest alarm status within the component.

You can provide an `icon` property within the threshold to show an icon that is associated with the breaching color/status

Supported Icon:
1. error
2. active
3. normal
4. acknowledged
5. snoozed
6. disabled
7. latched

```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR, StatusIcon, StreamType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '100%' }}>
  <KPI
    dataStreams={[
      {
        id: 'car-speed',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 50,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
        associatedStreams: [{
          id:'car-speed-alarm',
          type: StreamType.ALARM,
        }]
      },
      {
        id: 'car-speed-alarm',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'Warning',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      }
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#ff9900',
        value: 'Warning',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        dataStreamIds: ['car-speed-alarm'],
        icon: StatusIcon.LATCHED
      }],
    }}
    viewport={{ duration: 1000 }}
  />
</div>
```