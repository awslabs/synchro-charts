```jsx
import { ScatterChart } from "@synchro-charts/react";
<div style={{ width: '100%', height: '500px' }}>
  <ScatterChart
    trends={[{
      dataStreamId: 'car-count',
      type: 'linear-regression',
    }]}
    widgetId="widget-id"
    viewPort={{
      start: new Date(2000, 0, 0),
      end: new Date(2001, 0, 0),
    }}
    legend={{
      width: 100,
      position: 'BOTTOM',
    }}
    dataStreams={[{
      color: '#1d8102',
      name: 'Car Count',
      id: 'car-count',
      dataType: 'NUMBER',
      resolution: 1000 * 60 * 60 * 24, // one day
      aggregates: {
        [1000 * 60 * 60 * 24]: [{
          x: new Date(2000, 1, 0),
          y: 7,
        }, {
          x: new Date(2000, 3, 0),
          y: 18,
        }, {
          x: new Date(2000, 4, 0),
          y: 11,
        }, {
          x: new Date(2000, 5, 0),
          y: 30,
        }, {
          x: new Date(2000, 7, 0),
          y: 16,
        }, {
          x: new Date(2000, 8, 0),
          y: 26,
        }, {
          x: new Date(2000, 10, 0),
          y: 46,
        }, {
          x: new Date(2000, 11, 0),
          y: 29,
        }]
      },
    }]}
  />
</div>
```

Trend lines allow you to view overall trends in the data at a glance and, in the case of regression analysis, determine how closely the data fits a specific model.
Trend lines only make use of the data within the viewport, in addition to the two data points immediately outside of the viewport on either end.
Furthermore, trend lines are computed on the data after aggregation at the declared resolution.
    
**Note**: Currently we only support linear regressions for trend lines, but this may be extended in the future.
If there is a type that you want, please let us know!

