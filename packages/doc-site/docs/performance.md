
Performance is a key goal of Synchro Charts - we wish to allow people to visualize lots of data across many charts, while retaining a smooth user experience.

Interact with the charts below using the following gestures:
 - **Pan**: hold **shift**, click and drag on any chart
 - **Zoom In**: **double-click** on a position within a chart to zoom into that area.
 - **Zoom Out**: hold **shift** and **double-click** on a position within a chart to zoom away from that area.
 - **Restrict Time Span**: Click and drag through the interval of time you wish to restrict the viewport to.

Below is an example of synchronizing a group of charts containing half a million data points synchronized across 9 charts:

```jsx
import { ScatterChart } from "@synchro-charts/react";

const NUM_CHARTS = 9;
const NUM_POINTS = Math.round(500000 / NUM_CHARTS);
const TIME_SPAN = 1000 * 60 * 60 * 24 * 20;

<div style={{ width: "910px", height: "1200px", display: "flex", "flexWrap": 'wrap' }}>
{
new Array(3 * 3).fill(null).map((_, i) => {
return (
  <div key={i} style={{ width: "290px", height: "400px" }}>
    <ScatterChart
      widgetId={`chart-${i}`}
      size={{ marginRight: 10 }}
      viewPort={{
        yMin: -250,
        yMax: 250,
        start: new Date(2000, 0, 0),
        end: new Date(2000, 0, 1),
        group: 'perf'
      }}
      dataStreams={[
        {
          id: 'car-count',
          dataType: 'NUMBER',
          name: 'Car Count',
          color: i % 2 == 0 ? '#0073bb' : '#dd6b10',
          resolution: 0,
          /** Alter this number to change the number of data points on each chart! */
          data: new Array(NUM_POINTS).fill(null).map((_, pointIndex) => {
            const x = new Date(new Date(2000, 0, 0).getTime() + TIME_SPAN * (pointIndex / NUM_POINTS)).getTime();
            return {
              x, 
              y: Math.sin(x / 90000) * 200 + Math.random() * 40,
            };
          }),
        },
      ]}
    />
  </div>
)
})
}
</div>
```
