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
<sc-webgl-context />
```

This component will create a single canvas element which spans across the entire screen, and create an associated WebGL context to this canvas. Additionally, this component
contains some Synchro Charts specific logic so that components can register and be part of the various update loops.

#### Correct place of initialization

Ensure that the position of the `<sc-webgl-context />` is correct
 Since this component constructs the canvas which the visualizations are painted on, it's important that the `<sc-webgl-context />` is rendered on top of respective components.
 
 Here's an example of a correct utilization of the component:

 ```jsx static
    <div>
      <sc-line-chart ... />
      <sc-bar-chart ... />
      ...
      <sc-webgl-context />
    </div>
 ```
 
 Notice that the `<sc-webgl-context />` is initialized after the other visualizations - this ensures that the axis lines are rendered underneath the visualized data.

 More information about rendering HTML elements in the correct order within [Mozilla's documentation on stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

### Current pitfalls and issues

1. Visualization clips on bottom 16px of screen
   
   This [issue](https://github.com/awslabs/synchro-charts/issues/30) is caused due to the canvas constructed by the `<sc-webgl-context />` not covering the last `16px` of the screen. This issue
   will only be visible if you have no horizontal scroll bar on the bottom of the browser.
   
2. Visualized data briefly lag behind the associated component on browser resize

   The visualized data is rendered to an absolutely positioned location on the canvas, however when resizing the canvas size changes and breifly causes the visualizations rendered onto it to not align correctly.

3. Does not work well with components contained within nested scrolled areas.

   Currently, the WebGL context doesn't have a way to know that a component has moved when a scroll action takes place within a nested element on the browser.

   Synchro Charts however does work well when scrolling occurs to the entire page.

### Components which require a WebGL context

- Line chart
- Scatter chart
- Bar chart
- Status timeline