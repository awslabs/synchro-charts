
- `widgetId`: string

  The ID of the widget. Must be unique across all widgets.
  
--- 
  
- `viewport`: Object

    Specifies the window of data which will be visible within the widget.
    
    - `start`: Date

      (Optional) The earliest date within the viewport. Leave blank when viewing live time frames.
        
    - `end`: Date

      (Optional) The latest date within the viewport. Leave blank when viewing live time frames.
        
    - `yMin`: number

        (Optional) The minimum y-value viewable within the widget if present. Defaults to a value small enough to ensure
        all data within the viewport falls at or above the provided `yMin`.

    - `yMax`: number

        (Optional) The maximum y-value viewable within the widget if present. Defaults to a value large enough to ensure
        all data within the viewport falls at or below the provided `yMax`.
      
    - `duration`: number
    
      (Optional) The number of milliseconds the duration of the viewport is. Utilized to specify a live time frame. Leave blank when viewing historical time frames.

    - `group`: string

      (Optional) The identifier for the viewport group which the widget will belong to. All widgets within a viewport group
      will have their viewports 'synced' to the same value, i.e. if you pan on one chart, all charts within
      the viewport group will view the same data.

      Omitting the `group` results in the widget not being part of any viewport group.

--- 
  
- `axis`: Object

    (Optional) Specifies x and y-axis related settings. Defaults to showing both x and y axis.
    
    - `showX`: boolean
    
        (Optional) Setting to determine whether we show the x axis. Defaults to true.
        
    - `showY`: boolean
    
        (Optional) Setting to determine whether we show the y axis and the horizontal grid lines. Defaults to true.
      
  - `labels`: object
    
    (Optional) Setting to declare the axis labels
    
    - `yAxis`: object
    
      (Optional) Settings to declare the y-axis labels
    
      - `content`: string

        The y-axis label content

---

- `size` : Object
  
  (Optional): Specifies the precise dimensions that the widget should be. Defaults to take the size of the parent container.
  If margins are not manually set, they will default to reasonable values that work well with the legend.
  
  **Warning**: If you are not explicitly providing a size, it is important that the parent of the widget
  contains no other children; otherwise, styling issues will occur due to overflow.
  
  + `width`: number

    (Optional) The width of the entire widget, including margins, in pixels.

  + `height`: number

    (Optional) The height of the entire widget, including margins, in pixels.

  + `marginRight`: number

    (Optional) The margin between the data visualization area and either the legend (if the legend is positioned to the right) or the right side of the widget.
    Starts at the right side of the viewport. Defaults to a value which provides sensible padding.
        
  + `marginLeft`: number

    (Optional) The margin between the data visualization area and the left side of the chart.
    Starts at the left side of the viewport. Provides space for the left-sided y axis.
        
  + `marginTop`: number

    (Optional) The margin between the data visualization area and the top of the widget.
    Starts at the top of the viewport.

  + `marginBottom`: number

      (Optional) The margin between the data visualization area and either the legend (if the legend is positioned to the bottom) or the bottom of the widget.
      Starts at the bottom of the viewport. Defaults to a value which provides sensible padding.

---

- `dataStreams`: Object[]

  A collection of data streams, each representing a single data set.
  
  Each data stream contains the following information:

  - `id`: string
  
    A unique identifier for a given data stream.
  
  - `data`: Object[]

    Raw data (non-aggregated) for the stream. Note that once `resolution` is greater than 0, then it will switch from
    reading the data from this `data` property to reading the data from the `aggregates` property.
  
    - `x`: number
    
      Represents the point in time at which the data point was measured, in milliseconds since January 1, 1970 00:00:00 UTC, with leap seconds ignored. 
    
    - `y`: number or string or boolean 
    
      The value measured within the data point. Type depends on the data streams `dataType`.
  
  - `resolution`: number
  
    The resolution, in milliseconds, at which the data should be aggregated.
    To display raw data, set the resolution to 0.

  - `meta`: Object

    (Optional) object containing information associated to the `dataStream`. Object values can only be numbers, strings and booleans.

  - `dataType`: string
  
    The type of data contained within this stream. Must be one of the following:
  
    **`NUMBER`**: numerical data, such as `12.0`
  
    **`STRING`**: string data, such as categorical data `"OK"`, `"WARNING"`, etc.
 
    **`BOOLEAN`**: boolean data, such as `true` and `false`.

  - `name`: string

    A name by which to refer to the data stream. Utilized in the legend.

  - `aggregationType`: string
  
    (Optional) The type of aggregate data contained within the aggregates object:

    **`AVERAGE`**
    <!-- upcoming support **`COUNT`**, **`MAXIMUM`**, **`MINIMUM`**, **`STANDARD_DEVIATION`**, **`SUM`** -->

  - `aggregates`: Object
    
    (Optional) A map of resolution (in milliseconds) to its associated data points. The `resolution` in the `datastream`
    is a key in the `aggregates` object and must match to one of them in order to visualize the data stream on the visualizations.

    - `resolution` (key): number
      The resolution (in milliseconds) of the data.

    - data point (value): DataPoint[]
      The data points that are associated to this resolution.
        
  - `detailedName`: string

    (Optional) A more detailed name for the associated data stream, shown while hovering over the data stream information within the legend.

  - `unit`: string

    (Optional) The measurement unit of the y-values contained within the associated data stream, e.g. "m/s", "count".
    Utilized within the legend, etc. to give information about the data.

  - `color`: string

    (Optional) A CSS color string, e.g. "#5e87b5" or "red".
    
  - `isLoading`: boolean
  
    (Optional) Whether the data stream has never fetched data previously, and is currently fetching data. Defaults to false.
    
  - `isRefreshing`: boolean
  
     (Optional) Whether the data stream is currently fetching data, regardless of whether it has fetched data previously. Defaults to false.
     
  - `error`: string
  
    (Optional) A readable human error message if the data source this data stream is associated to has an error.
  
  - `associatedStreams`: Object[]
    
    (Optional) Data streams that are associated alarms of the data streams.

    - `id`: string

      The unique identifier for the data stream that is associated.
  
    - `streamType`: string 
      
      The data stream type for the associated data stream.

      Must be one of the following:

      **`ALARM`**: Alarm data stream type.
    
      **`ANOMALY`**: Anomaly data stream type.
    
      **`ALARM_THRESHOLD`**: Alarm threshold stream type. 
 
---

- `legend`: Object

  (Optional) Legend configuration. Omit to have no legend.

  + `position`: string
    
    The position of the legend within the widget. Must be one of the following:
  
    **`RIGHT`**: Position the legend on the right portion of the widget.

    **`BOTTOM`**: Position the legend on the bottom portion of the widget.
    
  + `width`: number
    
     Width in pixels of the legend while in the `RIGHT` position. Has no effect while in the `BOTTOM` position.

---

- `annotations`: Object

  (Optional) Annotations provide a mechanism to annotate a value along either the x-axis or the y-axis.
  Utilized to create thresholds to help monitor data streams to be within specified constraints.

  - `x`: Object[]
  
    (Optional) A collection of x-annotations. An x-annotation provides a mechanism to annotate a value along the x-axis.
  
    Each x-annotation contains the following information:
  
    - `color`: string
    
        The color for the annotation line, value and label. Can be any valid CSS string, e.g. '#333' or 'red'.
        
    - `value`: Date
    
        The value in the graph where the annotation will appear.
        
    - `showValue`: boolean
    
        (Optional) A setting to display the value of the annotation on the graph. Defaults to false.

    - `isEditable`: boolean
  
      (Optional) A setting to control whether the annotation is configurable from within the widget. Defaults to false.

    - `id`: string

      (Optional) The id for the annotation which can be set to any string value. This field allows annotations to be identified/distinguished when [`widgetUpdated`](#/API/Events) events are emitted.
        
    - `label`: Object
    
      (Optional) a label which can be optionally displayed.
      
      A label contains the following properties:
        
        - `text`: string
        
          A string that appears above the annotation.
          
        - `show`: boolean
        
          A setting to display the label of the annotation on the graph. Defaults to false. 
  
  - `y`: Object[]
  
    (Optional) collection of y-annotations. A y-annotation provides a mechanism to annotate a value along the y-axis.
  
    Each y-annotation contains the following information:
    
      - `color`: string
      
          The color for the annotation line, value and label. Can be any valid CSS string, e.g. '#333' or 'red'.
          
      - `value`: number
      
          The value in the graph where the annotation will appear.
          
      - `showValue`: boolean
      
          (Optional) A setting to display the value of the annotation on the graph.
          
      - `comparisonOperator`: string
      
        (Optional) A mechanism to provide a threshold. Select the operation you want to use for the threshold condition
        against the annotations `value` attribute.
        
        Must be one of the following:
 
        **`LT`**: Less than.
      
        **`LTE`**: Less than or equals.
      
        **`GT`**: Greater than.
      
        **`GTE`**: Greater than or equals.
      
        **`EQ`**: Equal.

      - `id`: string

        (Optional) The id for the annotation which can be set to any string value. This field allows annotations to be identified/distinguished when [`widgetUpdated`](#/API/Events) events are emitted.
      
      - `isEditable`: boolean

        (Optional) A setting to control whether the annotation is configurable from within the widget. Defaults to false.
        For example when `isEditable` is true on a line chart, you are able to drag the annotation handle to change the annotation value and emit [`widgetUpdated`](#/API/Events) events reflecting the new annotation.
        
      - `severity`: number
  
        (Optional) Specifies the severity of the threshold being breached. The lower the numerical number, the more importance is attributed to the threshold.
        The `severity` is used to determine which threshold to indicate as breached when a `DataStream` has multiple thresholds that are breached, simultaneously.
        
      - `label`: Object
      
        (Optional) a label which can be optionally displayed.
        
        A label contains the following properties:
          
          - `text`: string
          
            A string that appears above the annotation.
            
          - `show`: boolean
          
            A setting to display the label of the annotation on the graph.
            
- `thresholdOptions`: Object or Boolean
 
  (Optional) An threshold objects object to configure the thresholds. This setting will applie to all the thresholds.
  Also, note that you can pass in `false` to disable all threshold options
 
    - `showColor`: boolean

      (Optional) A setting to color the data points when it passes the threshold
            
---

- `trends`: Object[]

  (Optional) A collection of trend lines to be visualized on the data in the viewport.
  
  Each trend line contains the following information:

  - `dataStreamId`: string

    The ID of the associated data stream. If this ID does not match any data stream, the trend line will be ignored.

  - `type`: string
  
    The type of trend line to apply against the data. Must be equal to one of the following strings:
    
    - `linear-regression`
    
      Least-squares linear regression algorithm to determine the line of best fit against the data.

---

- `messageOverrides`: Object

    (Optional) Messages which can be customized. i.e. for internationalization, or business domain specific jargon.

    MessageOverrides contains the following properties:

    - `liveTimeFrameValueLabel`: string

      value label utilized in some widgets

    - `historicalTimeFrameValueLabel`: string

      value label utilized in some widgets

    - `noDataStreamsPresentHeader`: string
      
      message displayed when there are no data streams present

    - `noDataStreamsPresentSubHeader`: string

      message displayed when there are no data streams present

    - `noDataPresentHeader`: string

      message displayed when no streams have any data

    - `noDataPresentSubHeader`: string

      message displayed when no streams have any data

    - `liveModeOnly`: string

      message displayed when visualization displays only live data
