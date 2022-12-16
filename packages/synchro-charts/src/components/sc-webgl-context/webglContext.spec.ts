import 'webgl-mock-threejs';
import { Scene } from 'three';
import { createWebGLRenderer } from './webglContext';
import { constructChartScene } from '../charts/sc-webgl-base-chart/utils';
import { VIEWPORT } from '../charts/common/testUtil';
import { rectScrollFixed } from '../common/webGLPositioning';
import { ViewportHandler } from '../viewportHandler/viewportHandler';

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

export const createTestWebglRenderer = (domRect: DOMRect, skipInit = false, onContextInitialization?: () => void) => {
  const webGLRenderer = createWebGLRenderer(new ViewportHandler());
  // @ts-ignore
  const canvas = new HTMLCanvasElement(domRect.width, domRect.height);
  // @ts-ignore
  canvas.style = {};
  canvas.getBoundingClientRect = () => domRect;

  if (!skipInit) {
    webGLRenderer.initRendering(canvas, onContextInitialization);
  }

  return webGLRenderer;
};

const createTestChartScene = (viewportGroup?: string) => {
  const container = document.createElement('div');
  const chartScene = constructChartScene({
    scene: new Scene(),
    container,
    viewport: { ...VIEWPORT, group: viewportGroup },
    toClipSpace: x => x,
  });

  jest.spyOn(chartScene, 'updateViewPort');
  jest.spyOn(chartScene, 'dispose');

  return chartScene;
};

const VIEWPORT_GROUP = 'view-port-group';

describe('sync chart scene cameras', () => {
  it('syncs a single cameras viewport', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene();

    webGLRenderer.addChartScene({ manager: chartScene1 });
    webGLRenderer.setChartRect(chartScene1.id, rectScrollFixed(chartScene1.container));

    const start = new Date(2000, 0, 0);
    const end = new Date();
    webGLRenderer.updateViewPorts({ start, end, manager: chartScene1 });
    expect(chartScene1.updateViewPort).toBeCalledWith(expect.objectContaining({ start, end }));
  });

  it('syncs multiple cameras viewport', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene(VIEWPORT_GROUP);
    const chartScene2 = createTestChartScene(VIEWPORT_GROUP);

    webGLRenderer.addChartScene({ manager: chartScene1 });
    webGLRenderer.addChartScene({ manager: chartScene2 });
    webGLRenderer.setChartRect(chartScene1.id, rectScrollFixed(chartScene1.container));
    webGLRenderer.setChartRect(chartScene2.id, rectScrollFixed(chartScene2.container));

    const start = new Date(2000, 0, 0);
    const end = new Date();
    webGLRenderer.updateViewPorts({ start, end, manager: chartScene1 });
    expect(chartScene1.updateViewPort).toBeCalledWith(expect.objectContaining({ start, end }));
    expect(chartScene2.updateViewPort).toBeCalledWith(expect.objectContaining({ start, end }));
  });

  it('does not sync camera of removed chart scene', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene(VIEWPORT_GROUP);
    const chartScene2 = createTestChartScene(VIEWPORT_GROUP);

    webGLRenderer.addChartScene({ manager: chartScene1 });
    webGLRenderer.addChartScene({ manager: chartScene2 });

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
    webGLRenderer.addChartScene({ manager: chartScene });
    webGLRenderer.setChartRect(chartScene.id, rectScrollFixed(chartScene.container));

    webGLRenderer.removeChartScene(chartScene.id);
    expect(chartScene.dispose).toBeCalled();
  });

  it('disposes only of the removed chart scene', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect);

    const chartScene1 = createTestChartScene();
    const chartScene2 = createTestChartScene();

    webGLRenderer.addChartScene({ manager: chartScene1 });
    webGLRenderer.addChartScene({ manager: chartScene2 });

    webGLRenderer.setChartRect(chartScene1.id, rectScrollFixed(chartScene1.container));
    webGLRenderer.setChartRect(chartScene2.id, rectScrollFixed(chartScene2.container));

    webGLRenderer.removeChartScene(chartScene1.id);

    expect(chartScene1.dispose).toBeCalled();
    expect(chartScene2.dispose).not.toBeCalled();
  });
});

describe('when not initialized', () => {
  it('throws error when setChartRect is called', () => {
    const chartScene = createTestChartScene();
    const webGLRenderer = createTestWebglRenderer(testDomRect, true);
    expect(() => {
      webGLRenderer.setChartRect('some-id', rectScrollFixed(chartScene.container));
    }).toThrowError(/webgl context must be initialized before it can be utilized./);
  });

  it('throws error when onResolution is called', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect, true);
    expect(() => {
      webGLRenderer.onResolutionChange();
    }).toThrowError(/webgl context must be initialized before it can be utilized./);
  });

  it('throws error when render is called', () => {
    const chartScene = createTestChartScene();
    const webGLRenderer = createTestWebglRenderer(testDomRect, true);
    expect(() => {
      webGLRenderer.render(chartScene);
    }).toThrowError(/webgl context must be initialized before it can be utilized./);
  });

  it('throws error when removeChartScene is called', () => {
    const webGLRenderer = createTestWebglRenderer(testDomRect, true);
    expect(() => {
      webGLRenderer.removeChartScene('some-id');
    }).toThrowError(/webgl context must be initialized before it can be utilized./);
  });

  it('does not throw error when addChartScene is called', () => {
    const chartScene = createTestChartScene();
    const webGLRenderer = createTestWebglRenderer(testDomRect, true);
    expect(() => {
      webGLRenderer.addChartScene({ manager: chartScene });
    }).not.toThrowError();
  });
});

describe('on initialization', () => {
  it('calls custom onContextInitialization if provided', () => {
    const mockOnContextInitialization = jest.fn();
    createTestWebglRenderer(testDomRect, false, mockOnContextInitialization);
    expect(mockOnContextInitialization).toBeCalledTimes(1);
    expect(mockOnContextInitialization).toBeCalledWith(
      expect.objectContaining({
        drawingBufferHeight: 500,
        drawingBufferWidth: 500,
      })
    );
  });
});
