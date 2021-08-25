import { VisualizationProgram } from '../../sc-webgl-context/types';
import { VisualizationOptions } from '../sc-webgl-base-chart/types';
import { webGLRenderer } from '../../sc-webgl-context/webglContext';
import { SizeConfig, SizePositionConfig } from '../../../utils/dataTypes';

export class VisualizationManager {
  private visualizationMap: { [pluginId: string]: VisualizationProgram } = {};

  private getVisualizations = (): VisualizationProgram[] => {
    return Object.values(this.visualizationMap);
  };

  public getVisualization = (pluginId: string): VisualizationProgram | undefined => {
    return this.visualizationMap[pluginId];
  };

  public addVisualization = (programId: string, program: VisualizationProgram, options: VisualizationOptions): void => {
    webGLRenderer.addChartScene(program);
    this.visualizationMap[programId] = program;
    this.setPosition(options.chartSize, options.position);
  };

  public removeVisualization = (pluginId: string): void => {
    webGLRenderer.removeChartScene(pluginId);
    delete this.visualizationMap[pluginId];
  };

  /**
   * Set position
   *
   * Registers the chart rectangle, which tells webGL where to render the data visualization to.
   * This must be called each time after a scene is set.
   */
  private setPosition = (
    { width, height, marginLeft, marginTop }: SizeConfig,
    { x, y, left, top }: SizePositionConfig
  ): void => {
    this.getVisualizations().forEach(program => {
      webGLRenderer.setChartRect(program.id, {
        width,
        height,
        x: x + marginLeft,
        y: y + marginTop,
        left: left + marginLeft,
        top: top + marginTop,
        right: left + marginLeft + width,
        bottom: top + marginTop + height,
        density: window.devicePixelRatio,
      });
    });
  };

  public dispose = () => {
    this.getVisualizations().forEach(visualization => {
      webGLRenderer.removeChartScene(visualization.id);

      if (visualization.dispose) {
        visualization.dispose();
      }
    });
  };

  /**
   * Update viewport
   *
   * Changes to cameras to show from `start` to `end` on all visualizations managed.
   */
  public updateViewport = ({ start, end }: { start: Date; end: Date }) => {
    // TODO: if a widget has no `viewport.group`, then we should automatically assign one so all the scenes stay in sync
    // NOTE: we only need to update view port on one scene, since the rest will be synced.
    const [scene] = this.getVisualizations();
    if (scene) {
      webGLRenderer.updateViewPorts({ start, end, manager: scene });
    }
  };

  /**
   * Renders visualization associated with plugin if it exists.
   */
  public render = (pluginId: string, causesLayoutChange: boolean, options: VisualizationOptions) => {
    const visualization = this.getVisualization(pluginId);

    if (causesLayoutChange) {
      this.setPosition(options.chartSize, options.position);
    }

    if (visualization) {
      webGLRenderer.render(visualization);

      if (causesLayoutChange) {
        // if the layout has changed, then we need to wait till the next 'frame'
        // until the DOM has updated to it's new position.
        window.setTimeout(() => {
          if (visualization) {
            webGLRenderer.render(visualization);
          }
        }, 0);
      }
    }
  };
}
