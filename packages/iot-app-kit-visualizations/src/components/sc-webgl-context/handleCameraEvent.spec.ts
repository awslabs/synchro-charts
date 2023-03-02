import { Vector3 } from 'three';
import { ChartScene } from './types';
import { handleCameraEvent } from './handleCameraEvent';
import { chartScene } from '../charts/sc-line-chart/chartScene';

// Default Camera Viewport
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2001, 0, 0);
const Y_MIN = 200;
const Y_MAX = 300;

it('updates camera position for associated scene info', () => {
  const scene = chartScene({
    viewport: {
      start: X_MIN,
      end: X_MAX,
      yMin: Y_MIN,
      yMax: Y_MAX,
    },
    dataStreams: [],
    container: document.createElement('div'),
    chartSize: { width: 100, height: 100 },
    minBufferSize: 100,
    bufferFactor: 2,
    thresholdOptions: {
      showColor: false,
    },
    thresholds: [],
  });

  const originalProjectionMatrix = scene.camera.projectionMatrix.clone();
  const dx = 300;
  const dy = 50;

  handleCameraEvent({ dx, dy, sceneId: scene.id, scale: 1 }, [scene]);

  expect(scene.camera.position.x).toBe(-dx);
  expect(scene.camera.position.y).toBe(dy);
  expect(scene.camera.scale).toStrictEqual(new Vector3(1, 1, 1));
  expect(scene.camera.projectionMatrix).toStrictEqual(originalProjectionMatrix);
});

it('updates all cameras x positions', () => {
  const chartScenes: ChartScene[] = [
    chartScene({
      viewport: {
        start: X_MIN,
        end: X_MAX,
        yMin: Y_MIN,
        yMax: Y_MAX,
      },
      dataStreams: [],
      container: document.createElement('div'),
      chartSize: { width: 100, height: 100 },
      minBufferSize: 100,
      bufferFactor: 2,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    }),
    chartScene({
      viewport: {
        start: X_MIN,
        end: X_MAX,
        yMin: Y_MIN,
        yMax: Y_MAX,
      },
      dataStreams: [],
      container: document.createElement('div'),
      chartSize: { width: 100, height: 100 },
      minBufferSize: 100,
      bufferFactor: 2,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    }),
  ];

  const selectedCamera = chartScenes[0].camera;
  const unselectedCamera = chartScenes[1].camera;
  const selectedOriginalProjectionMatrix = selectedCamera.projectionMatrix.clone();
  const unselectedOriginalProjectionMatrix = unselectedCamera.projectionMatrix.clone();

  const dx = 103;
  const dy = 84;

  handleCameraEvent({ dx, dy, sceneId: chartScenes[0].id, scale: 1 }, chartScenes);
  expect(selectedCamera.position.x).toBe(-dx);
  expect(selectedCamera.position.y).toBe(dy);
  expect(unselectedCamera.position.x).toBe(-dx);
  expect(unselectedCamera.position.y).toBe(0);
  expect(unselectedCamera.projectionMatrix).toStrictEqual(unselectedOriginalProjectionMatrix);
  expect(selectedCamera.projectionMatrix).toStrictEqual(selectedOriginalProjectionMatrix);
});

it('does not update camera position when there is no associated scene info', () => {
  const scenes: ChartScene[] = [
    chartScene({
      viewport: {
        start: X_MIN,
        end: X_MAX,
        yMin: Y_MIN,
        yMax: Y_MAX,
      },
      dataStreams: [],
      container: document.createElement('div'),
      chartSize: { width: 100, height: 100 },
      minBufferSize: 100,
      bufferFactor: 2,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    }),
  ];

  const { camera } = scenes[0];
  const originalProjectionMatrix = camera.projectionMatrix.clone();
  const dx = 30;
  const dy = 50;

  expect(() => handleCameraEvent({ dx, dy, sceneId: 'fake-id', scale: 1 }, scenes)).toThrow(/fake-id/);
  // camera remains unchanged
  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBe(0);
  expect(camera.scale).toStrictEqual(new Vector3(1, 1, 1));
  expect(camera.projectionMatrix).toStrictEqual(originalProjectionMatrix);
});
