```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR, StreamType } from '@synchro-charts/core';

<div style={{ width: '100%', height: '100%' }}>
  <StatusGrid
    dataStreams={[
      {
        id: 'wind-temperature',
        name: 'Wind temperature',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 15,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
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
        color: '#ff9900',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'Warning',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
      {
        id: 'motor-rpm',
        name: 'RPM',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 30,
        }],
        resolution: 0,
        dataType: DataType.NUMBER,
      },
    ]}
    labelsConfig={{ showName: true, showValue: true, showUnit: true }}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#1d8102',
        value: 0,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      },
        {
          color: '#d13212',
          value: 25,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
        {
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

> **Supported data type(s): Number, String, Boolean** 
> (alarm streams excluded) 

Status Grid visualizes the latest status for a given data stream by emphasizing the current status of a property.

The color of the status grid is determined by the threshold color. If no threshold is provided or no status is
breaching the threshold, then the default color is grey.

Regardless of the threshold color you provided, the color of the text will contrast for you automatically.

The status grid also provides a way for you to show or hide the name, the value and/or the unit through the labels' config.



### Status grid without threshold
```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR } from '@synchro-charts/core';

<div style={{ width: '100%', height: '100%' }}>
  <StatusGrid
    dataStreams={[
      {
        id: 'wind-temperature',
        name: 'Wind temperature',
        data: [{
          x: new Date(2001, 0, 0),
          y: 15,
        }],
        unit: 'C', 
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'motor-rpm',
        name: 'Motor RPM',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 30,
        }],
        resolution: 0,
        dataType: DataType.NUMBER,
      },
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
      },
    ]}
    labelsConfig={{ showName: true, showValue: true, showUnit: true }}
    widgetId="widget-id"
    viewport={{ duration: 1000 }}
  />
</div>
```

### Status grid with threshold
```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR } from '@synchro-charts/core';

<div style={{ width: '100%', height: '100%' }}>
  <StatusGrid
    dataStreams={[
      {
        id: 'wind-temperature',
        name: 'Wind temperature',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 15,
        }],
        unit: 'C', 
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'motor-rpm',
        name: 'Motor RPM',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 30,
        }],
        resolution: 0,
        dataType: DataType.NUMBER,
      }
    ]}
    labelsConfig={{ showName: true, showValue: true, showUnit: true }}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#0073bb',
        value: 0,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      },
      {
        color: '#1d8102',
        value: 25,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }],
    }}
    viewport={{ duration: 1000 }}
  />
</div>
```

Here is an example of a status grid breaching a blue threshold.

While it is breached, it will color the cell with threshold color to indicate that the threshold is breached. If there is
a threshold and that threshold is not breached, the color of the cell will remain grey.

The color of the text is automatically set to white or black to provide readability depending on the background color.


### Status grid with alarm
```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR, StreamType } from '@synchro-charts/core';

<div style={{ width: '100%', height: '100%' }}>
  <StatusGrid
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
    labelsConfig={{ showName: true, showValue: true, showUnit: true }}
    widgetId="widget-id"
    annotations={{
      y: [{
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

When you have an alarm data stream that is associated with another data stream, it will be combined into one single
status grid cell to display both information in a single place. It will emphasize the alarm status while indicating the
associated property value.

To associate a data stream to an alarm data stream, you will need to specify the `associatedDataStream` property for
the property data stream to provide it with the association to the alarm.

An example of an association:

```jsx static
    dataStreams={[
      {
        ...  
        associatedDataStream: [{
            id: 'alarm-data-stream-id',
            type: 'ALARM'
        }]
      }
    ]}
```

Hovering over the status grid will give you more in-depth information about the data value as well as the alarm status.
