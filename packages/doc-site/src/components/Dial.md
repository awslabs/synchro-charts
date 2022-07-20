```js
import { COMPARISON_OPERATOR, StatusIcon, StreamType } from '@synchro-charts/core';
<div style={{ width: '100%', height: '100%' }}>
  <Dial
    widgetId="test-widget"
    dataStream={this.dataStream}
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
          color: '#000000',
          value: 1579,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
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
