/* eslint-disable import/first */
jest.mock('../../sc-webgl-context/webglContext');

import { VisualizationManager } from './VisualizationManager';
import { createVisualization, mockProgramOptions } from './mocks';

it('initializes', () => {
  expect(() => new VisualizationManager()).not.toThrowError();
});

it('adds visualization without throwing error', () => {
  const PLUGIN_ID = 'plugin-id';
  const visualizationManager = new VisualizationManager();
  const visualization = createVisualization();

  expect(() =>
    visualizationManager.addVisualization(PLUGIN_ID, visualization, mockProgramOptions())
  ).not.toThrowError();
});

describe('get visualization', () => {
  it('returns visualization when visualization exists', () => {
    const PLUGIN_ID = 'plugin-id';
    const visualizationManager = new VisualizationManager();
    const visualization = createVisualization();

    visualizationManager.addVisualization(PLUGIN_ID, visualization, mockProgramOptions());

    expect(visualizationManager.getVisualization(PLUGIN_ID)).toBe(visualization);
  });

  it('returns undefined when getting non-existent visualization', () => {
    const controller = new VisualizationManager();
    expect(controller.getVisualization('fake-plugin')).toBeUndefined();
  });
});

describe('removal', () => {
  it('removes visualization', () => {
    const PLUGIN_ID = 'plugin-id';
    const visualizationManager = new VisualizationManager();
    const visualization = createVisualization();

    visualizationManager.addVisualization(PLUGIN_ID, visualization, mockProgramOptions());
    visualizationManager.removeVisualization(PLUGIN_ID);

    expect(visualizationManager.getVisualization(PLUGIN_ID)).toBeUndefined();
  });

  it('does nothing when removing a non-existent visualization', () => {
    const PLUGIN_ID = 'fake-plugin-id';
    const visualizationManager = new VisualizationManager();
    expect(() => visualizationManager.removeVisualization(PLUGIN_ID)).not.toThrowError();
  });
});

describe('dispose', () => {
  it('does nothing when dispose with no visualization added', () => {
    const visualizationManager = new VisualizationManager();
    expect(() => visualizationManager.dispose()).not.toThrowError();
  });

  it('disposes single visualization', () => {
    const PLUGIN_ID = 'plugin-id';
    const visualizationManager = new VisualizationManager();
    const visualization = { ...createVisualization(), dispose: jest.fn() };

    visualizationManager.addVisualization(PLUGIN_ID, visualization, mockProgramOptions());

    visualizationManager.dispose();

    expect(visualization.dispose).toBeCalled();
  });

  it('disposes multiple visualization', () => {
    const visualizationManager = new VisualizationManager();

    const vis1 = { ...createVisualization(), dispose: jest.fn() };
    const vis2 = { ...createVisualization(), dispose: jest.fn() };

    visualizationManager.addVisualization('plugin-1', vis1, mockProgramOptions());
    visualizationManager.addVisualization('plugin-2', vis2, mockProgramOptions());

    visualizationManager.dispose();

    expect(vis1.dispose).toBeCalled();
    expect(vis2.dispose).toBeCalled();
  });
});

describe('updateViewports', () => {
  it('does nothing when updateViewports with no programs added', () => {
    const visualizationManager = new VisualizationManager();
    expect(() => visualizationManager.updateViewport({ start: new Date(), end: new Date() })).not.toThrowError();
  });
});

describe('renders', () => {});
