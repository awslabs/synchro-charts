
To communicate any changes triggered from the widgets internally, the widget will initiate the following events which you may optionally listen for.

### `widgetUpdated`

An event fired when via a widget, the configuration has been altered.

Currently, this event is only fired when titles of a widget are altered.

### `dateRangeChange`

An event which is fired upon manually enacted changes to the view port, such as panning or zooming into a chart.

The structure is the following:

```js static
{
  // [startDate, endDate, lastUpdatedBy]
  detail: [Date, Date, string | undefined];
}
```

