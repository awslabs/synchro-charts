import { event } from 'd3-selection';

/**
 * Filter which gestures fire which events which will get
 * interpreted as zoom/panning events within the chart.
 */
export const filterGestures = () => {
  // Disables multi touch drag & mouse wheel sense these interfere with scrolling gestures,
  // Since the charts are used in a context where horizontal and vertical scroll are used.
  if (event.type === 'wheel') {
    return false;
  }
  if (event.type === 'mousedown') {
    // don't allow panning without pressing [shift] key
    return event.shiftKey;
  }
  // Default filter applied to `d3-zoom`
  return !event.ctrlKey && !event.button;
};
