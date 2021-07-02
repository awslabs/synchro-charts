
* Data must be time series with numerical values, i.e. a data point must be `(x = timestamp, y = number)`
* Does not handle aggregations of data client side.
* Line charts will support on the scale of a half million points performantly if defined statically. Primary performance bottleneck will be on the number of charts updating simultaneously, and the amount of network requests firing.
