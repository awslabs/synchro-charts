Basic Usage:

```jsx static
<sc-webgl-context />
```

This creates a single shared canvas and WebGL rendering context for use on all WebGL widgets.

This solves two problems:

1. Having a lot of WebGL contexts is very expensive from a performance perspective.
2. Related to the performance considerations, browsers will limit the number of contexts you can have.
    - https://bugzilla.mozilla.org/show_bug.cgi?id=1421481
    - https://bugs.chromium.org/p/chromium/issues/detail?id=771792
    
To get around that, we share a single WebGL renderer across all widgets.

### Pitfalls

#### Positioning (z-depth)

**Make sure your context has the correct z-depth**: Make sure the context is positioned in such a location which
 places it in the correct depth context ensuring you can see your data in the expected manner.

#### Data Not Appearing in Bottom/Right Margins

The context stretches the entire screen minus 16 pixels on the bottom and right side of the browser.
This is due to the potential of scrollbars being present. This means data will not appear at this 16px margin.
