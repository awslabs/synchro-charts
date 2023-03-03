# Synchro Charts design overview
Synchro Charts consists of a series of visualization components, all of which visualize time-series data.

## Universal description of data
Synchro Charts visualization supports data in the form of `DataStream`, which you can find a detailed description within https://synchrocharts.com/#/API/Properties.

## Viewport
Every visualization has a concept of a `viewport`, which describes what interval of time is being 'viewed'.

`viewport`s can either represent an absolute range of time, or a relative time frame (i.e. last 5 minutes).

## Synchronization
All Synchro Charts visualizations synchronize their viewport within the specified 'viewport group'.
This makes it easy to use Synchro Charts to provide a 'in sync' view of data across multipple visualizations.

Synchro Charts achieves this synchronization, through the `ViewPortManager` interface. By registering a `ViewPortManager`, 
a component is able to receive callbacks to update it's `viewport` accordingly, through the `updateViewport` method.

## Base components

### Base chart

The base chart provides an easy way to make a particular type of visualization, such as a line chart. Learn more about it
within the [base chart documentation](base-chart.md).

## Component distribution

Synchro Charts uses https://stenciljs.com/ to build Synchro Charts as a series of web components.

Synchro Charts also exposes a react wrapped version, at https://github.com/awslabs/synchro-charts/tree/main/packages/synchro-charts-react

It is necessary to provide thin wrappers around some frameworks, otherwise users are left with plumbing work to allow them to pass
in rich data and function as properties as required by Synchro Charts API.