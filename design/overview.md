# IoT App Kit Visualizations design overview
IoT App Kit Visualizations consists of a series of visualization components, all of which visualize time-series data.

## Universal description of data
IoT App Kit Visualizations visualization supports data in the form of `DataStream`, which you can find a detailed description within https://synchrocharts.com/#/API/Properties.

## Viewport
Every visualization has a concept of a `viewport`, which describes what interval of time is being 'viewed'.

`viewport`s can either represent an absolute range of time, or a relative time frame (i.e. last 5 minutes).

## Synchronization
All IoT App Kit Visualizations visualizations synchronize their viewport within the specified 'viewport group'.
This makes it easy to use IoT App Kit Visualizations to provide a 'in sync' view of data across multipple visualizations.

IoT App Kit Visualizations achieves this synchronization, through the `ViewPortManager` interface. By registering a `ViewPortManager`, 
a component is able to receive callbacks to update it's `viewport` accordingly, through the `updateViewport` method.

## Base components

### Base chart

The base chart provides an easy way to make a particular type of visualization, such as a line chart. Learn more about it
within the [base chart documentation](base-chart.md).

## Component distribution

IoT App Kit Visualizations uses https://stenciljs.com/ to build IoT App Kit Visualizations as a series of web components.

IoT App Kit Visualizations also exposes a react wrapped version, at https://github.com/awslabs/synchro-charts/tree/main/packages/iot-app-kit-visualizations-react

It is necessary to provide thin wrappers around some frameworks, otherwise users are left with plumbing work to allow them to pass
in rich data and function as properties as required by IoT App Kit Visualizations API.