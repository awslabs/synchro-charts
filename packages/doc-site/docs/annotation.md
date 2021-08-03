```jsx
import { LineChart, ScatterChart, BarChart } from "@synchro-charts/react";

const DAY_RESOLUTION = 1000 * 60 * 60 * 24; // one day
const style = { width: '100%' };

const standardAnnotation = {
  color: 'red',
  value: 40,
  showValue: true,
};

const draggableAnnotation = {
  color: 'blue',
  value: 60,
  showValue: true,
  isEditable: true, //enables dragging of annotation
};

const annotations = {
  y: [standardAnnotation, draggableAnnotation],
};
const viewport = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  group: 'viewport-group',
};
const legend = {
  width: 100,
  position: 'BOTTOM',
}
const dataStreams = [{
  id: 'car-count',
  dataType: 'NUMBER',
  color: '#1d8102',
  name: 'Car Count',
  resolution: DAY_RESOLUTION, // one day
  aggregates: {
    [DAY_RESOLUTION]: [{
      x: new Date(2000, 1, 0).getTime(),
      y: 7,
    }, {
      x: new Date(2000, 3, 0).getTime(),
      y: 18,
    }, {
      x: new Date(2000, 4, 0).getTime(),
      y: 11,
    }, {
      x: new Date(2000, 5, 0).getTime(),
      y: 30,
    }, {
      x: new Date(2000, 7, 0).getTime(),
      y: 16,
    }, {
      x: new Date(2000, 8, 0).getTime(),
      y: 26,
    }, {
      x: new Date(2000, 10, 0).getTime(),
      y: 46,
    }, {
      x: new Date(2000, 11, 0).getTime(),
      y: 100,
    }]
  }
}];

<div style={{ display: 'flex', width: '100%', height: '500px' }}>
  <LineChart
    style={style}
    annotations={annotations}
    widgetId="widget-id"
    viewport={viewport}
    legend={legend}
    dataStreams={dataStreams}
  />
  <ScatterChart
    style={style}
    annotations={annotations}
    widgetId="widget-id"
    viewport={viewport}
    legend={legend}
    dataStreams={dataStreams}
  />
  <BarChart
    style={style}
    annotations={annotations}
    widgetId="widget-id"
    viewport={viewport}
    legend={legend}
    dataStreams={[{
      id: 'car-count',
      dataType: 'NUMBER',
      resolution: 1000 * 60 * 24 * 60 * 24,
      color: '#1d8102',
      aggregates: {
        [1000 * 60 * 24 * 60 * 24]: [{
          x: new Date(2000, 1, 0).getTime(),
          y: 7,
        }, {
          x: new Date(2000, 3, 0).getTime(),
          y: 18,
        }, {
          x: new Date(2000, 4, 0).getTime(),
          y: 11,
        }, {
          x: new Date(2000, 5, 0).getTime(),
          y: 30,
        }, {
          x: new Date(2000, 7, 0).getTime(),
          y: 16,
        }, {
          x: new Date(2000, 8, 0).getTime(),
          y: 26,
        }, {
          x: new Date(2000, 10, 0).getTime(),
          y: 46,
        }, {
          x: new Date(2000, 11, 0).getTime(),
          y: 100,
        }]
      }
    }]}
  />
</div>
```

Annotations allow you to visually check if a metric has crossed a pre-defined value,
or to mark an event that has happened at a specific point in time.


### How To Set Up Annotations

Simply pass in a `Y annotation` array to visualize the Y annotation on the graph. Here is an exmaple:

```jsx static
  <LineChart
    ...
    annotations={{
       y: [{
           color: 'red',
           value: 40,
           showValue: true,
       }],
     }}
  />
```


When there are no thresholds, passing in the threshold options will not affect anything. 

```jsx static
  <LineChart
    ...
    annotations={{
       y: [{
           color: 'red',
           value: 40,
           showValue: true,
       }],
       thresholdOptions: {
           showColor: true,
       }               
     }}
  />
```

### Draggable Annotations 

To enable dragging of certain Y Annotations and thresholds as shown above, set `isEditable` of the annotation to `true` (`isEditable` is `false` by default). 
When an annotation/threshold is dragged to a new value, a [`widgetUpdated`](#/API/Events) event is emitted 
which contains the updated annotation value along with other properties of the widget. Note that only Y Annotations are 
draggable at this time.

```jsx static
const draggableAnnotation = {
  color: 'blue',
  value: 60,
  showValue: true,
  isEditable: true, //enables dragging of annotation
};
```
