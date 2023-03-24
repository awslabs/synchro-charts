
To communicate any changes triggered from the widgets internally, the widget will initiate the following events which you may optionally listen for.

### `widgetUpdated`

An event fired when the configuration of a widget is altered.

Currently, this event is only fired when 

  1. The name of a `dataStream` is updated from within the legend 

  2. A y-annotation is dragged to a new value 

