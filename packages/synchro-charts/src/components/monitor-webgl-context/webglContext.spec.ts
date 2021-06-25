import 'webgl-mock-threejs';
import { Scene } from 'three';
import { createWebGLRenderer } from './webglContext';
import { constructChartScene } from '../charts/sc-webgl-base-chart/utils';
import { VIEW_PORT } from '../charts/common/testUtil';
import { rectScrollFixed } from '../common/webGLPositioning';

const testDomRect: DOMRect = {
  height: 500,
  width: 500,
  x: 0,
  y: 0,
  left: 0,
  top: 0,
  bottom: 500,
  right: 500,
  toJSON: () => '{}',
};

export const createTestWebglRenderer = (domRect: DOMRect) => {
  const webGLRenderer = createWebGLRenderer();
  // @ts-ignore
  const canvas = new HTMLCanvasElement(domRect.width, domRect.height);
  canvas.style = {};
  canvas.getBoundingClientRect = () => domRect;
  webGLRenderer.initRendering(canvas);

  return webGLRenderer;
};

const createTestChartScene = (viewPortGroup?: string) => {
  const container = document.createElement('div');
  const chartScene = constructChartScene({
    scene: new Scene(),
    container,
    viewPort: { ...VIEW_PORT, group: viewPortGroup },
    toClipSpace: x => x,
  });

  jest.spyOn(chartScene, 'updateViewPort');
  jest.spyOn(chartScene, 'dispose');

  return chartScene;
};

const VIEW_PORT_GROUP = 'view-port-group';

describe('sync chart scene cameras', () => {
  it('syncs a single cameras viewport', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene();

    webGLRenderer.addChartScene(chartScene1);
    webGLRenderer.setChartRect(chartScene1.id, rectScrollFixed(chartScene1.container));

    const start = new Date(2000, 0, 0);
    const end = new Date();
    webGLRenderer.updateViewPorts({ start, end, manager: chartScene1 });
    expect(chartScene1.updateViewPort).toBeCalledWith({ start, end });
  });

  it('syncs multiple cameras viewport', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene(VIEW_PORT_GROUP);
    const chartScene2 = createTestChartScene(VIEW_PORT_GROUP);

    webGLRenderer.addChartScene(chartScene1);
    webGLRenderer.addChartScene(chartScene2);
    webGLRenderer.setChartRect(chartScene1.id, rectScrollFixed(chartScene1.container));
    webGLRenderer.setChartRect(chartScene2.id, rectScrollFixed(chartScene2.container));

    const start = new Date(2000, 0, 0);
    const end = new Date();
    webGLRenderer.updateViewPorts({ start, end, manager: chartScene1 });
    expect(chartScene1.updateViewPort).toBeCalledWith({ start, end });
    expect(chartScene2.updateViewPort).toBeCalledWith({ start, end });
  });

  it('does not sync camera of removed chart scene', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene(VIEW_PORT_GROUP);
    const chartScene2 = createTestChartScene(VIEW_PORT_GROUP);

    webGLRenderer.addChartScene(chartScene1);
    webGLRenderer.addChartScene(chartScene2);

    webGLRenderer.setChartRect(chartScene1.id, rectScrollFixed(chartScene1.container));
    webGLRenderer.setChartRect(chartScene2.id, rectScrollFixed(chartScene2.container));

    webGLRenderer.removeChartScene(chartScene1.id);

    const start = new Date(2000, 0, 0);
    const end = new Date();

    webGLRenderer.updateViewPorts({ start, end, manager: chartScene1 });

    expect(chartScene1.updateViewPort).not.toBeCalled();
    expect(chartScene2.updateViewPort).toBeCalled();
  });
});

describe('disposal of removed chart scene', () => {
  it('disposes a chart scene when removed', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene = createTestChartScene();
    webGLRenderer.addChartScene(chartScene);
    webGLRenderer.setChartRect(chartScene.id, rectScrollFixed(chartScene.container));

    webGLRenderer.removeChartScene(chartScene.id);
    expect(chartScene.dispose).toBeCalled();
  });

  it('disposes only of the removed chart scene', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene();
    const chartScene2 = createTestChartScene();

    webGLRenderer.addChartScene(chartScene1);
    webGLRenderer.addChartScene(chartScene2);

    webGLRenderer.setChartRect(chartScene1.id, rectScrollFixed(chartScene1.container));
    webGLRenderer.setChartRect(chartScene2.id, rectScrollFixed(chartScene2.container));

    webGLRenderer.removeChartScene(chartScene1.id);

    expect(chartScene1.dispose).toBeCalled();
    expect(chartScene2.dispose).not.toBeCalled();
  });
});
