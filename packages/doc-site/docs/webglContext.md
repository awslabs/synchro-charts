In order to utilize Synchro Chart components which use WebGL to render the data, we will need to correctly initialize the WebGL context.

### Why?
In order to utilize WebGL, there must be a WebGL context initialized, which will allow you to render graphics onto a `canvas` element.

However, there is a limit to the number of WebGL contexts which can be present within a browser. This limit can vary based on the browser utilized, but for Chrome that limit is 16.
When more WebGL contexts are created than the browser supports, previously initialized WebGL contexts will disappear, causing the associated visualizations using that context to also disappear.

In order to prevent having a limit of the number of visualizations utilizing WebGL, we share a single WebGL instance across all visualizations.

Unfortunately, this presents a couple of complications, since the WebGL context must exist outside the individual components, and the canvas associated with the
WebGL context must be large enough to contain all the visualizations. 

### How to set up the WebGL context

To set up the WebGL context, you will create a single instance of the following web component:

```jsx static
<iot-app-kit-vis-webgl-context />
```

This component will create a single canvas element, and create an associated WebGL context to this canvas. Additionally, this component
contains some IoT App Kit Visualizations specific logic so that components can register and be part of the various update loops.

By default the canvas element will consider the viewport as the viewing frame. The viewing frame is a rectangle in which the chart data is visible.
If you want the viewport to be the viewing frame, place the context component in the DOM such that the document is its position scope.

```jsx static

<iot-app-kit-vis-webgl-context />

or

<iot-app-kit-vis-webgl-context viewFrame={window} />
```

Additionally you can pick an HTML Element as the viewing frame. This element should operate similar to the viewport in that it can scroll child contents that overflow
and will respond to resizing events.

*Note: The viewing frame can't be larger than the viewport size. The canvas will start clipping anything past that bound.*

```jsx static
<iot-app-kit-vis-webgl-context viewFrame={document.querySelector('#myViewFrame')} />
```

#### Correct place of initialization

Ensure that the position of the `<iot-app-kit-vis-webgl-context />` is correct
 Since this component constructs the canvas which the visualizations are painted on, it's important that the `<iot-app-kit-vis-webgl-context />` is rendered on top of respective components.
 
 Here's an example of a correct utilization of the component:

 ```jsx static
    <div>
      <iot-app-kit-vis-line-chart ... />
      <iot-app-kit-vis-bar-chart ... />
      ...
      <iot-app-kit-vis-webgl-context />
    </div>
 ```
 
 Notice that the `<iot-app-kit-vis-webgl-context />` is initialized after the other visualizations - this ensures that the axis lines are rendered underneath the visualized data.

 More information about rendering HTML elements in the correct order within [Mozilla's documentation on stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

### Accessing the WebGL Context

It can be useful to have direct access to the underlying WebGL context for purposes such as debugging.

The `<iot-app-kit-vis-webgl-context />` web component has a functional prop `onContextInitialization` that is called with a `WebGLRenderingContext` after initialization.

```jsx static
<iot-app-kit-vis-webgl-context onContextInitialization={(context) => {
   // your code
}} />
```

This callback can be used to, for example, instrument your development environment with tools such as [WebGL Lint](https://github.com/greggman/webgl-lint).

### Current pitfalls and issues

1. Visualization clips on bottom 16px of screen
   
   This [issue](https://github.com/awslabs/synchro-charts/issues/30) is caused due to the canvas constructed by the `<iot-app-kit-vis-webgl-context />` not covering the last `16px` of the screen. This issue
   will only be visible if you have no horizontal scroll bar on the bottom of the browser.
   
2. Visualized data briefly lag behind the associated component on browser resize

   The visualized data is rendered to an absolutely positioned location on the canvas, however when resizing the canvas size changes and breifly causes the visualizations rendered onto it to not align correctly.

3. Does not work well with components contained within nested scrolled areas.

   Currently, the WebGL context doesn't have a way to know that a component has moved when a scroll action takes place within a nested element on the browser.

   IoT App Kit Visualizations however does work well when scrolling occurs to the entire page.

### Components which require a WebGL context

- Line chart
- Scatter chart
- Bar chart
- Status timeline