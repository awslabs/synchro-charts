```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR } from '@synchro-charts/core';
const windTableColumn = {
  header: 'Wind temperture',
  rows:[
    'wind-temperture-station-1',
    'wind-temperture-station-2',
    'wind-temperture-station-3',
    'wind-temperture-station-4',
    'wind-temperture-station-5',
    'wind-temperture-station-6',
  ],
};

const carSpeedTableColumn = {
  header: 'Car speed',
  rows:[
    'car-speed',
    'car-speed-2',
    'car-speed-3',
    'car-speed-4',
    'car-speed-5',
    'car-speed-6',
  ],
};

<div style={{ width: '100%', height: '300px' }}>
  <Table
    dataStreams={[
      {
        id: 'wind-temperture-station-1',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 15,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-2',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 30,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-3',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 40,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-4',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 50,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-5',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 60,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-6',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 70,
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
      },
      {
        id: 'car-speed-2',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 100,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-3',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 110,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-4',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 120,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-5',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 130,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-6',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 160,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      }
    ]}
    widgetId="widget-id"
    viewport={{ duration: 0, start: new Date(1999, 0, 0), end: new Date(2001, 0, 0) }}
    tableColumns={[windTableColumn, carSpeedTableColumn]}
  />
</div>
```

Table components help visualizes a group of data streams that is closely associated with each other under one column.
Each of the cells in the table represents one data stream. You have to use the `tableColumns` property to group a
set of data streams under one column.

An example of creating the table column:
```jsx static
const windTableColumn = {
  header: 'Wind temperture',
  rows:['wind-temperture-station-1', 'wind-temperture-station-2'],
};
```

The `header` property is the name of the column and the `rows` property is a list of data streams that will be rendered under that
column in the array's order.

In this example, we are showing temperatures from two different weather stations.


### Table with thresholds
```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR } from '@synchro-charts/core';
const windTableColumn = {
  header: 'Wind temperture',
  rows:[
    'wind-temperture-station-1',
    'wind-temperture-station-2',
    'wind-temperture-station-3',
    'wind-temperture-station-4',
    'wind-temperture-station-5',
    'wind-temperture-station-6',
  ],
};

const carSpeedTableColumn = {
  header: 'Car speed',
  rows: [
    'car-speed', 
    'car-speed-2',
    'car-speed-3',
    'car-speed-4',
    'car-speed-5',
    'car-speed-6',
  ],
};

<div style={{ width: '100%', height: '300px' }}>
  <Table
    dataStreams={[
      {
        id: 'wind-temperture-station-1',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 15,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-2',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 30,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-3',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 40,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-4',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 50,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-5',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 60,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-6',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 70,
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
      },
      {
        id: 'car-speed-2',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 100,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-3',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 110,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-4',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 120,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-5',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 130,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'car-speed-6',
        name: 'Car speed',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 160,
        }],
        unit: 'MPH',
        resolution: 0,
        dataType: DataType.NUMBER,
      }
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#d13212',
        value: 0,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#ff9900',
        value: 20,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#1d8102',
        value: 40,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#687078',
        value: 60,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#3184c2',
        value: 100,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#FF0000',
        value: 120,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }, {
        color: '#1d8102',
        value: 160,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      }],
    }}
    legend= {{
      width: 100,
      position: LEGEND_POSITION.BOTTOM,
    }}
    viewport={{ duration: 0, start: new Date(1999, 0, 0), end: new Date(2001, 0, 0) }}
    tableColumns={[windTableColumn, carSpeedTableColumn]}
  />
</div>
```

### Table with alarms

In this example we are rendering the `wind temperature` data and its associated alarm data.

In order to have the status icon rendered next to the alarm status, you need to use the `icon` property in the threshold.

Like the KPI, table status icon currently supports:
1. error
2. active
3. normal
4. acknowledged
5. snoozed
6. disabled
7. latched

```jsx
import { LEGEND_POSITION, DataType, COMPARISON_OPERATOR, StatusIcon, StreamType } from '@synchro-charts/core';
const windTableColumn = {
    header: 'Wind temperture',
    rows:[
      'wind-temperture-station-1', 
      'wind-temperture-station-2',
      'wind-temperture-station-3',
      'wind-temperture-station-4',
      'wind-temperture-station-5',
      'wind-temperture-station-6',
    ],
};

const windTempAlarm = {
  header: 'Status',
  rows:[
    'wind-temperture-station-1-alarm', 
    'wind-temperture-station-2-alarm',
    'wind-temperture-station-3-alarm',
    'wind-temperture-station-4-alarm',
    'wind-temperture-station-5-alarm',
    'wind-temperture-station-6-alarm',
  ],
};

<div style={{ width: '100%', height: '300px' }}>
  <Table
    dataStreams={[
      {
        id: 'wind-temperture-station-1',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 15,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-2',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 30,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-3',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 40,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-4',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 50,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-5',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 60,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-6',
        name: 'Wind temperture',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 70,
        }],
        unit: 'C',
        resolution: 0,
        dataType: DataType.NUMBER,
      },
      {
        id: 'wind-temperture-station-1-alarm',
        name: 'station 1 alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'ACTIVE',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
      {
        id: 'wind-temperture-station-2-alarm',
        name: 'station 2 alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'WARNING',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
      {
        id: 'wind-temperture-station-3-alarm',
        name: 'station 3 alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'ERROR',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
      {
        id: 'wind-temperture-station-4-alarm',
        name: 'station 4 alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'NORMAL',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
      {
        id: 'wind-temperture-station-5-alarm',
        name: 'station 5 alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'SNOOZED',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
      {
        id: 'wind-temperture-station-6-alarm',
        name: 'station 6 alarm',
        data: [{
          x: new Date(2001, 0, 0).getTime(),
          y: 'DISABLED',
        }],
        resolution: 0,
        dataType: DataType.STRING,
        streamType: StreamType.ALARM,
      },
    ]}
    widgetId="widget-id"
    annotations={{
      y: [{
        color: '#d13212',
        value: 'ACTIVE',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        icon: StatusIcon.ACTIVE
      }, {
        color: '#ff9900',
        value: 'WARNING',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        icon: StatusIcon.LATCHED
      }, {
        color: '#FF0000',
        value: 'ERROR',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        icon: StatusIcon.ERROR
      }, {
        color: '#1d8102',
        value: 'NORMAL',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        icon: StatusIcon.NORMAL
      }, {
        color: '#879596',
        value: 'SNOOZED',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        icon: StatusIcon.SNOOZED
      }, {
        color: '#687078',
        value: 'DISABLED',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        icon: StatusIcon.DISABLED
      }],
    }}
    legend= {{
      width: 100,
      position: LEGEND_POSITION.BOTTOM,
    }}
    viewport={{ duration: 0, start: new Date(1999, 0, 0), end: new Date(2001, 0, 0) }}
    tableColumns={[windTableColumn, windTempAlarm]}
  />
</div>
```