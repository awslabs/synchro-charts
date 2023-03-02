# Chart Development Guide

## Theme

The chart is designed to be extensible, but there is a flexability/ease-of-use & complexity depending on how we expose the theme.
Taking inspiration from other popular component libraries such as MaterialUI, Bootstrap, etc.., we will utilize a shared, limited
collection of variables tied to 'generic use' rather than exposing a more granular theme which ties theme variables to specific components.

The chart should be set up to be colored as according to the pallete, as opposed to exposing a theme by
allowing specific parts of the chart to be specified.

**GOOD**:
Do use a limited set of css variables which apply to all components
```css
.grid-axis-x {
    stroke-width: var(--thin-line-width);
    stroke-color: var(--primary-light);
}
```

**BAD**:
Do not utilize per component specific css variables part of the theme
```css
.grid-axis-x {
    stroke-width: var(--grid-axis-x-width);
    stroke-color: var(--grid-axis-x-color);
}
```

**BAD**:
Do not make theme variables be color specific
```css
.grid-axis-x {
    stroke-color: var(--light-red);
}
```

**BAD**:
Do not utilize the chart configuration for part specific themes
```jsx
<GridAxisX 
  style={{
    strokeWidth: xAxisGridStrokeWidth,
    strokeColor: xAxisGridColor,
  }}
/>
```

### References
- https://material-ui.com/customization/color/ - understand the material UI Pallet structure
- https://material.io/resources/color - pallet generator for material UI
- https://github.com/d3/d3-scale-chromatic

## Chart Architecture

The chart should be designed as a framework, with the ability to plugin in behavior. This is vital for allowing us to scale the number of features. 
This constraint of structure provides us with benefits of more easily adding features, at the cost of limiting flexability. 
Below I would like to go over the following constraints imposed within the charts architecture.

### Use of D3 Select event Listeners
To register multiple event listeners for the same event on the same element, we need to add an optional namespace like `mouseover.my-register-name`.

Without the use of the optional namespace, the newly added event will simply replace the older one.

To ensure that developers does not accidentally over ride other people's event listeners on the same element, the convention is to use `[eventName].[uniqueName]` 

https://stackoverflow.com/questions/33106742/d3-add-more-than-one-functions-to-an-eventlistener
### Use of Scales
Scales implemented by `d3-scales` is a critical part of the design of this chart framework.
Scales are simply pure functions that map our data to pixel positions. 

Utilizing scales, we can implement features such as panning, scaling, alternate scale types (logrimithic, linear, etc.) all using scales.

#### General guidlines for scales

- Change scales and apply them rather than altering chart config. chart config should be reserved for persistent settings not transient state.
- Pass around scales, not pixels

### Data Streams Renderer

A `dataStreamsRenderer` is a render function which determines how the data streams are rendered. This function is the primary differentiator
between different chart types, such as bar charts, scatter plots and line charts.

- Operates on an array of data streams rather than just a single data stream.

While it would allow certain chart types to have a simpler implementation by making the api pass a single
data stream, this would prevent chart visualizations where the rendering of one data stream
effects the rendering of another data stream. How ever this will be a necessary ability since certain chart types such as 
bar chart, will have each bar rendered different dependent on
1. number of data streams present
2. the ordering of the data streams

For this reason, individual chart implementations specify how to render a list of data streams instead of how to just render
a single data stream.

- Provided the x and y scales

Individual chart implementations don't have to be concerned with the scales types, panning, zooming etc..,
instead the specific chart implementations can focus on what to render, and then utilize the scales provided to map it into
`pixel space` so to speak. 

The general rule present is that pixel positions should be computed at leaf components, and that scales should be passed around rather than pixel positions.

### Tool Tip Renderer

Since tool tips implementation varies by chart type, the tool tips provide a pluggable render function.

**TO BE FILLED OUT**