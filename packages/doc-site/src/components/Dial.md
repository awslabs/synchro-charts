# Overview
```js
import { COMPARISON_OPERATOR, StatusIcon, StreamType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '100%' }}>
  <Dial
    widgetId="test-widget"
    dataStream={{
    id: 'car-speed-alarm',
    name: 'Wind temperature',
    data: [
      {
        x: new Date(2001, 0, 0).getTime(),
        y: latestValue || Y_MIN + 30,
      },
    ],
    unit: unit || '',
    resolution: 0,
    dataType: DATA_TYPE,
    isLoading: JSON.parse(isloading || 'false'),
  }}
    size={{
      height: 300,
      width: 300,
    }}
    viewport={{ yMin: Y_MIN, yMax: Y_MAX, duration: 1000 }}
  />
</div>
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

```js
import { COMPARISON_OPERATOR, StatusIcon, StreamType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '100%' }}>
  <Dial
    widgetId="test-widget"
    dataStream={{
    id: 'car-speed-alarm',
    name: 'Wind temperature',
    data: [
      {
        x: new Date(2001, 0, 0).getTime(),
        y: latestValue || Y_MIN + 30,
      },
    ],
    unit: unit || '',
    resolution: 0,
    dataType: DATA_TYPE,
    isLoading: JSON.parse(isloading || 'false'),
  }}
    size={{
      height: 300,
      width: 300,
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
          color: '',
          value: 'Critical',
          comparisonOperator: COMPARISON_OPERATOR.EQUAL,
          dataStreamIds: ['car-speed-alarm'],
          icon: StatusIcon.ERROR,
        },
      ],
    }}
    viewport={{ yMin: Y_MIN, yMax: Y_MAX, duration: 1000 }}
  />
</div>
```