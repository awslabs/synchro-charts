
To communicate any changes triggered from the widgets internally, the widget will initiate the following events which you may optionally listen for.

### `widgetUpdated`

An event fired when the configuration of a widget is altered.

Currently, this event is only fired when 

  1. The name of a `dataStream` is updated from within the legend 

  2. A Y Annotation or Threshold is dragged to a new value 

### `dateRangeChange`

An event which is fired upon manually enacted changes to the view port, such as panning or zooming into a chart.

The structure is the following:

```js static
{
  // [startDate, endDate, lastUpdatedBy]
  detail: [Date, Date, string | undefined];
}
```

