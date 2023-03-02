export interface ViewPortManager {
  id: string;
  viewportGroup?: string;
  // Hook which is called with viewport is updated
  updateViewPort: (viewportUpdate: {
    start: Date;
    end: Date;
    duration?: number;
    shouldBlockDateRangeChangedEvent?: boolean;
  }) => void;
  // Disposes of all all scene, it's geometries, and any materials that are specific to the scene.
  // Dispose should be called whenever a chart scene is no longer used, otherwise the application
  // will leak memory
  dispose?: () => void;
}
