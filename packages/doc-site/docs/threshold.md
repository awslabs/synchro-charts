```jsx
import { LineChart, ScatterChart, BarChart } from "@synchro-charts/react";

const DAY_RESOLUTION = 1000 * 60 * 60 * 24; // one day
const style = { width: '100%' };

const standardThreshold = {
  color: '#d13212',
  value: 40,
  showValue: true,
  comparisonOperator: 'GTE',
};

const annotations = {
  y: [standardThreshold],
};
const viewport = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  group: 'threshold',
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

Threshold allows you quickly visualize if a metric is outside of a pre-defined value by coloring the physical data points on the graph.

A threshold is a type of annotation; that is to say, all thresholds are annotations, but not all annotations are thresholds.
In order to make an annotation become a threshold, the property `comparisonOperator` is needed in the annotation object.
Unlike an annotation, when a metric passes a threshold, the legend and the tooltip will change to the threshold color.

By default, the thresholds will have coloration enabled. Meaning, when data passes the threshold, it will change to the threshold color.
**Note: Currently, only y-annotations can become a threshold.**

### How To Set Up Thresholds

By default, annotations are not thresholds. To elevate an Y annotation into a threshold, pass in the `comparisonOperator` property. 

`Note`: the default behavior of a threshold is to show the color change when data points pass through a threshold.
```jsx static
  <LineChart
    ...
    annotations={{
       y: [{
           color: 'red',
           value: 40,
           showValue: true,
           comparisonOperator: 'GTE',
       }], 
     }}
  />
```

In order to turn off the default behavior of the threshold data coloring, simply pass in `showColor: false`

```jsx static
  <LineChart
    ...
    annotations={{
       y: [{
           color: 'red',
           value: 40,
           showValue: true,
           comparisonOperator: 'GTE',
       }],
       thresholdOptions: {
           showColor: false,
       }               
     }}
  />
```

Alternatively, you may pass in a boolean `false` into the `thresholdOptions` to turn off all threshold defaults.


```jsx static
  <LineChart
    ...
    annotations={{
       y: [{
           color: 'red',
           value: 40,
           showValue: true,
           comparisonOperator: 'GTE',
       }],
       thresholdOptions: false          
     }}
  />
```

### Draggable thresholds

```jsx
import { LineChart, ScatterChart, BarChart } from "@synchro-charts/react";

const DAY_RESOLUTION = 1000 * 60 * 60 * 24; // one day
const style = { width: '100%' };

const draggableThresholdTwo = {
  color: 'red',
  value: 40,
  showValue: true,
  comparisonOperator: 'GTE',
  isEditable: true,
};

const draggableThresholdOne = {
  color: 'blue',
  value: 18,
  showValue: true,
  comparisonOperator: 'LTE',
  isEditable: true,
};

const annotations = {
  y: [draggableThresholdOne, draggableThresholdTwo],
};
const viewport = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  group: 'threshold',
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

To enable dragging of thresholds as shown above, set `isEditable` of the threshold to `true` (`isEditable` is `false` by default).
When a threshold is dragged to a new value, a [`widgetUpdated`](#/API/Events) event is emitted
which contains the updated threshold value along with other properties of the widget. 

```jsx static
const draggableThreshold = {
  color: 'blue',
  value: 40,
  showValue: true,
  comparisonOperator: 'GTE',
  isEditable: true,
};
```


### Threshold breaching/chart coloration logic explained

If you have two thresholds that has the same comparison operator pointing upwards but at different value, 
then you will create threshold bands. 

```jsx
import { LineChart, ScatterChart, BarChart } from "@synchro-charts/react";

const style = { width: '100%' }; 
const annotations = {
  y: [{
    color: '#d13212',
    value: 40,
    showValue: true,
    comparisonOperator: 'GTE',
  }, {
    color: '#ff9900',
    value: 20,
    showValue: true,
    comparisonOperator: 'GTE',
  }],
};
const viewport = {
   start: new Date(2000, 0, 0),
   end: new Date(2001, 0, 0),
};
const legend = {
  width: 100,
  position: 'BOTTOM',
}

const dataStreams = [{
  id: 'car-count',
  dataType: 'NUMBER',
  color: 'black',
  name: 'Car Count',
  resolution: 1000 * 60 * 60 * 24, // one day
  aggregates: {
    [1000 * 60 * 60 * 24]: [{
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
  },
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
</div>
```

Here is an example of threshold with negative threshold values and with the same comparison operators pointing downwards.

```jsx
import { LineChart, ScatterChart, BarChart } from "@synchro-charts/react";

const style = { width: '100%' }; 
const annotations = {
  y: [{
    color: '#d13212',
    value: -40,
    showValue: true,
    comparisonOperator: 'LTE',
  }, {
    color: '#ff9900',
    value: -20,
    showValue: true,
    comparisonOperator: 'LTE',
  }],
};
const viewport = {
   start: new Date(2000, 0, 0),
   end: new Date(2001, 0, 0),
};
const legend = {
  width: 100,
  position: 'BOTTOM',
}

const dataStreams = [{
  id: 'car-count',
  dataType: 'NUMBER',
  color: 'black',
  name: 'Car Count',
  resolution: 1000 * 60 * 60 * 24, // one day
  aggregates: {
    [1000 * 60 * 60 * 24]: [{
      x: new Date(2000, 1, 0).getTime(),
      y: -7,
    }, {
      x: new Date(2000, 3, 0).getTime(),
      y: -18,
    }, {
      x: new Date(2000, 4, 0).getTime(),
      y: -11,
    }, {
      x: new Date(2000, 5, 0).getTime(),
      y: -30,
    }, {
      x: new Date(2000, 7, 0).getTime(),
      y: -16,
    }, {
      x: new Date(2000, 8, 0).getTime(),
      y: -26,
    }, {
      x: new Date(2000, 10, 0).getTime(),
      y: -46,
    }, {
      x: new Date(2000, 11, 0).getTime(),
      y: -100,
    }]
  },
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
</div>
```

Below is an example of two horizontal thresholds intersecting each other with opposing comparison operator.
Notice that the upper threshold's color overrides the lower threshold's color.

```jsx
import { LineChart, ScatterChart, BarChart } from "@synchro-charts/react";

const style = { width: '100%' }; 
const annotations = {
  y: [{
    color: '#d13212',
    value: 90,
    showValue: true,
    comparisonOperator: 'LTE',
  }, {
    color: '#ff9900',
    value: 20,
    showValue: true,
    comparisonOperator: 'GTE',
  }],
};
const viewport = {
   start: new Date(2000, 0, 0),
   end: new Date(2001, 0, 0),
};
const legend = {
  width: 100,
  position: 'BOTTOM',
}

const dataStreams = [{
  id: 'car-count',
  dataType: 'NUMBER',
  color: 'black',
  name: 'Car Count',
  resolution: 1000 * 60 * 60 * 24, // one day
  aggregates: {
    [1000 * 60 * 60 * 24]: [{
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
  },
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
</div>
```
This is an example of two thresholds intersecting each other with opposing comparison operator in the values below 0.
Notice that the threshold color with greater negative value overrides the lesser negative value. 

```jsx
import { LineChart, ScatterChart, BarChart } from "@synchro-charts/react";

const style = { width: '100%' }; 
const annotations = {
  y: [{
    color: '#d13212',
    value: -90,
    showValue: true,
    comparisonOperator: 'GTE',
  }, {
    color: '#ff9900',
    value: -20,
    showValue: true,
    comparisonOperator: 'LTE',
  }],
};
const viewport = {
   start: new Date(2000, 0, 0),
   end: new Date(2001, 0, 0),
};
const legend = {
  width: 100,
  position: 'BOTTOM',
}

const dataStreams = [{
  id: 'car-count',
  dataType: 'NUMBER',
  color: 'black',
  name: 'Car Count',
  resolution: 1000 * 60 * 60 * 24, // one day
  aggregates: {
    [1000 * 60 * 60 * 24]: [{
      x: new Date(2000, 1, 0).getTime(),
      y: -7,
    }, {
      x: new Date(2000, 3, 0).getTime(),
      y: -18,
    }, {
      x: new Date(2000, 4, 0).getTime(),
      y: -11,
    }, {
      x: new Date(2000, 5, 0).getTime(),
      y: -30,
    }, {
      x: new Date(2000, 7, 0).getTime(),
      y: -16,
    }, {
      x: new Date(2000, 8, 0).getTime(),
      y: -26,
    }, {
      x: new Date(2000, 10, 0).getTime(),
      y: -46,
    }, {
      x: new Date(2000, 11, 0).getTime(),
      y: -100,
    }]
  },
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
</div>
```