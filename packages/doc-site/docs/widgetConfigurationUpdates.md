Certain customization to the widget will cause the widget to emit `widgetUpdate` event. This event contains certain information
about the configuration change.

Below is an example of how you would listen for this event and act on the change.

```jsx static
element.addEventListener('widgetUpdated', event => {
    // Do something with the newly updated widget configuration change
});
```

The widget updated event object will contain the chart's API. For example, an update to the data streams name, the chart
will emit an event that looks like this
```js static
{
  ..., // Other chart configs
  widgetId: 'widget-id',  
  dataStreams: [{ id: 'some-stream', name: 'updated-name' }]
}
```

Note that the `widgetId` will always guaranteed come back as part of the event object. However, for the `dataStreams`
property, the `data` will be omitted.
