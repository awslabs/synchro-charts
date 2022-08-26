```jsx
import {LineChart} from "@synchro-charts/react";

const DAY_RESOLUTION = 1000 * 60 * 60 * 24; // one day
<div style={{width: "900px", height: "400px"}}>
    <LineChart
      widgetId="chart-1"
      viewport={{
        duration: 5 * 60000,
        group: 'my-group',
      }}
      dataStreams={[]}
    />
</div>;
```

Live mode is a concept where the chart will automatically shift the viewport forward. The live mode frame rate is
determined by the chart width as well as the `duartion`. If you have a small duration with a wide chart width, then the
frame rate will update more frequently than the large duration in a smaller chart width. 

### How to enable live mode

By having `duartion` property within the `viewport` API, we can enable live mode. The `duration` specifies the time range
from `now - duration` to `now` in the viewport. 

To disable this feature, simple set the `start` and the `end` property instead of the `duration`.

```jsx static
<LineChart
  viewport={{
    duartion: SECOND_IN_MS
  }}
  ...
/>
```