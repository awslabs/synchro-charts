# Overview

```jsx
import { COMPARISON_OPERATOR, StatusIcon, StreamType, DataType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '300px' }}>
  <Dial
    widgetId="test-widget"
    dataStream={{
      id: 'car-speed-alarm',
      name: 'Wind temperature',
      data: [
        {
          x: new Date(2001, 0, 0).getTime(),
          y: 900,
        },
      ],
      resolution: 0,
      dataType: DataType.NUMBER,
    }}
    viewport={{ yMin: 0, yMax: 2000, duration: 1000 }}
  />
</div>;
```

```jsx
import { COMPARISON_OPERATOR, StatusIcon, StreamType, DataType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '300px' }}>
  <Dial
    widgetId="test-widget"
    dataStream={{
      id: 'car-speed-alarm',
      name: 'Wind temperature',
      data: [
        {
          x: new Date(2001, 0, 0).getTime(),
          y: 700,
        },
      ],
      unit: 'rpm',
      resolution: 0,
      dataType: DataType.NUMBER,
    }}
    viewport={{ yMin: 0, yMax: 2000, duration: 1000 }}
  />
</div>;
```

```jsx
import { COMPARISON_OPERATOR, StatusIcon, StreamType, DataType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '300px' }}>
  <Dial
    widgetId="test-widget"
    dataStream={{
      id: 'car-speed-alarm',
      name: 'Wind temperature',
      data: [
        {
          x: new Date(2001, 0, 0).getTime(),
          y: 700.354,
        },
      ],
      unit: 'rpm',
      resolution: 0,
      dataType: DataType.NUMBER,
    }}
    viewport={{ yMin: 0, yMax: 2000, duration: 1000 }}
  />
</div>;
```

### Dial with alarms

You can show the current latest alarm status on the legend through setting the `icon` property for the threshold.

You can provide an `icon` property within the threshold to show an icon that is associated with the breaching color/status.

Supported Icon:

1. error
2. normal
3. latched

Corresponding value:

1. Critical
2. Warning
3. Normal

```jsx
import { COMPARISON_OPERATOR, StatusIcon, StreamType, DataType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '300px' }}>
  <Dial
    widgetId="test-widget"
    dataStream={{
      id: 'car-speed-alarm',
      name: 'Wind temperature',
      data: [
        {
          x: new Date(2001, 0, 0).getTime(),
          y: 1500,
        },
      ],
      resolution: 0,
      dataType: DataType.NUMBER,
    }}
    associatedStreams={[
      {
        id: 'car-speed-alarm',
        type: StreamType.ALARM,
      },
    ]}
    annotations={{
      y: [
        {
          color: "#C03F25",
          value: 660,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
          dataStreamIds: ['car-speed-alarm'],
          label: {
            text: 'Critical',
            show: true,
          },
          icon: StatusIcon.ERROR,
        },{
          color: "#F29D38",
          value: 1320,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
          dataStreamIds: ['car-speed-alarm'],
          label: {
            text: 'Warning',
            show: true,
          },
          icon: StatusIcon.LATCHED,
        },{
          color: "#3F7E23",
          value: 1320,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
          dataStreamIds: ['car-speed-alarm'],
          label: {
            text: 'Normal',
            show: true,
          },
          icon: StatusIcon.NORMAL,
        },
      ],
    }}
    viewport={{ yMin: 0, yMax: 2000, duration: 1000 }}
  />
</div>;
```
