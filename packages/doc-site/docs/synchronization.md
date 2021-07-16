```jsx
import { LineChart } from "@synchro-charts/react";

const DAY_RESOLUTION = 1000 * 60 * 60 * 24; // one day
<div style={{ width: "900px", height: "400px", display: "flex" }}>
  <div style={{ width: "300px", height: "400px" }}>
    <LineChart
      widgetId="chart-1"
      viewport={{
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
        group: 'my-group',
      }}
      dataStreams={[
        {
          id: 'car-count',
          dataType: 'NUMBER',
          color: '#1d8102',
          name: 'Car Count',
          resolution: DAY_RESOLUTION, // one day
          aggregates: {
            [DAY_RESOLUTION]: [
              {
                x: new Date(2000, 1, 0).getTime(),
                y: 7,
              },
              {
                x: new Date(2000, 3, 0).getTime(),
                y: 18,
              },
              {
                x: new Date(2000, 4, 0).getTime(),
                y: 11,
              },
              {
                x: new Date(2000, 5, 0).getTime(),
                y: 30,
              },
              {
                x: new Date(2000, 7, 0).getTime(),
                y: 16,
              },
              {
                x: new Date(2000, 8, 0).getTime(),
                y: 26,
              },
              {
                x: new Date(2000, 10, 0).getTime(),
                y: 46,
              },
              {
                x: new Date(2000, 11, 0).getTime(),
                y: 100,
              },
            ]
          }
        },
      ]}
    />
  </div>

  <div style={{ width: "300px", height: "400px" }}>
    <LineChart
      widgetId="chart-2"
      viewport={{
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
        group: 'my-group',
      }}
      dataStreams={[
        {
          id: 'car-count',
          dataType: 'NUMBER',
          color: 'purple',
          name: 'Car Count',
          resolution: DAY_RESOLUTION, // one day
          aggregates: {
            [DAY_RESOLUTION]: [
              {
                x: new Date(2000, 1, 0).getTime(),
                y: 7,
              },
              {
                x: new Date(2000, 3, 0).getTime(),
                y: 18,
              },
              {
                x: new Date(2000, 4, 0).getTime(),
                y: 11,
              },
              {
                x: new Date(2000, 5, 0).getTime(),
                y: 30,
              },
              {
                x: new Date(2000, 7, 0).getTime(),
                y: 16,
              },
              {
                x: new Date(2000, 8, 0).getTime(),
                y: 26,
              },
              {
                x: new Date(2000, 10, 0).getTime(),
                y: 46,
              },
              {
                x: new Date(2000, 11, 0).getTime(),
                y: 100,
              },
            ]
          }
        },
      ]}
    />
  </div>
  <div style={{ width: "300px", height: "400px" }}>
    <LineChart
      widgetId="chart-3"
      viewport={{
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
        group: 'my-group',
      }}
      dataStreams={[
        {
          id: 'car-count',
          dataType: 'NUMBER',
          color: 'red',
          name: 'Car Count',
          resolution: DAY_RESOLUTION, // one day
          aggregates: {
            [DAY_RESOLUTION]: [
              {
                x: new Date(2000, 1, 0).getTime(),
                y: 7,
              },
              {
                x: new Date(2000, 3, 0).getTime(),
                y: 18,
              },
              {
                x: new Date(2000, 4, 0).getTime(),
                y: 11,
              },
              {
                x: new Date(2000, 5, 0).getTime(),
                y: 30,
              },
              {
                x: new Date(2000, 7, 0).getTime(),
                y: 16,
              },
              {
                x: new Date(2000, 8, 0).getTime(),
                y: 26,
              },
              {
                x: new Date(2000, 10, 0).getTime(),
                y: 46,
              },
              {
                x: new Date(2000, 11, 0).getTime(),
                y: 100,
              },
            ]
          }
        },
      ]}
    />
  </div>
</div>;
```

Utilizing the `group` property within the `viewport` API, we can define a group of charts which will stay in sync.

Below is an example of three synchronized charts:

NOTE: This is achieved by giving each of the three charts the same `group` value. If this attribute is not provided, no synchronization will occur.


### How To Synchronize

The default behavior of a chart is to not synchronize with any other charts. To opt into synchronizing with a group of charts, simply pass in a matching `group` string in the `viewport`.

```jsx static
<LineChart
  widgetId="chart-1"
  viewport={{
    group: 'my-group',
  }}
  ...
/>
<LineChart
  widgetId="chart-2"
  viewport={{
    group: 'my-group',
  }}
  ...
/>
```

Any number of view port groups may be defined, such as below:

```jsx static
<LineChart
  widgetId="chart-1"
  viewport={{
    group: 'my-group',
  }}  ...
/>
<LineChart
  widgetId="chart-2"
  viewport={{
    group: 'my-group',
  }}  ...
/>
<LineChart
  widgetId="chart-3"
  viewport={{
    group: 'my-second-group',
  }}  ...
/>
<LineChart
  widgetId="chart-4"
  viewport={{
    group: 'my-second-group',
  }}
  ...
/>
```

Here we have defined two `group`s: `my-group` and `my-second-group`.

When you interact with one chart within a view port group, all the charts will stay in sync.
