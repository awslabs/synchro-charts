import groupBy from 'lodash.groupby';
import {
  VisualizationChanges,
  VisualizationOptions,
  RenderVisualizations,
  PluginRegistry,
} from '../sc-webgl-base-chart/types';
import { VisualizationManager } from './VisualizationManager';

const DEFAULT_CHANGE_EVERYTHING: VisualizationChanges = {
  hasAnnotationChanged: true,
  hasDataChanged: true,
  hasSizeChanged: true,
};

export class PluginManager {
  private plugins: PluginRegistry;
  private visualizations: VisualizationManager;

  constructor({ registry, controller }: { registry: PluginRegistry; controller: VisualizationManager }) {
    this.plugins = registry;
    this.visualizations = controller;
  }

  /**
   * Handle the rendering of a single visualization
   */
  private renderVisualization = ({
    pluginId,
    options,
    changes,
  }: {
    pluginId: string;
    options: VisualizationOptions;
    changes: VisualizationChanges;
  }) => {
    const visualizations = this.visualizations.getVisualization(pluginId);
    const plugin = this.plugins.getPlugin(pluginId);
    const causesLayoutChange = changes.hasSizeChanged;

    if (visualizations == null) {
      /**
       * Create visualization
       */
      const newVisualization = plugin.create(options);
      this.visualizations.addVisualization(pluginId, newVisualization, options);
      if (options.onUpdate) {
        options.onUpdate(options.viewport);
      }

      this.visualizations.render(newVisualization.id, causesLayoutChange, options);
    } else {
      /**
       * Update existing visualization
       */
      const updatedVisualization = plugin.update({
        ...options,
        ...changes,
        scene: visualizations,
      });

      /**
       * Re-register visualization if necessary
       *
       * This can be caused due to needing to re-allocate memory to increase buffer size, for instance.
       */
      const isNewVisualization = updatedVisualization.id !== visualizations.id;
      if (isNewVisualization) {
        this.visualizations.removeVisualization(visualizations.id);
        this.visualizations.addVisualization(pluginId, updatedVisualization, options);
      }

      this.visualizations.render(visualizations.id, causesLayoutChange, options);
    }
  };

  /**
   * Render
   *
   * Renders all visualizations onto the same section of canvas, as specified by the passed in `container`
   *
   * Will default to assume everything needs to be re-render. Provide more narrow set of changes to improve performance.
   */
  render: RenderVisualizations = (options, changes = DEFAULT_CHANGE_EVERYTHING) => {
    const dataStreamsByPlugin = groupBy(options.dataStreams, dataStream => dataStream.visualizationType);
    const pluginIds = Object.keys(dataStreamsByPlugin);

    // render all of our visualizations, based on the plugin being utilized for the given data stream
    pluginIds.forEach(pluginId => {
      const visualizedDataStreams = dataStreamsByPlugin[pluginId];
      this.renderVisualization({
        pluginId,
        options: {
          ...options,
          dataStreams: visualizedDataStreams,
        },
        changes,
      });
    });
  };

  /**
   * Update viewport
   *
   * Changes to cameras to show from `start` to `end` on all visualizations managed.
   */
  updateViewport = ({ start, end }: { start: Date; end: Date }) => {
    this.visualizations.updateViewport({ start, end });
  };

  /**
   * Dispose
   *
   * Releases all memory from all visualizations
   */
  dispose = () => {
    this.visualizations.dispose();
  };
}
