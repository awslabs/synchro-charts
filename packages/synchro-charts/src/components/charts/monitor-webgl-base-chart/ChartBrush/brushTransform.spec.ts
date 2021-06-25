import { scaleTime } from 'd3-scale';

import { createBrushTransform } from './brushTransform';
import { CHART_CONFIG } from '../../common/testUtil';

describe('creates a brush transformation', () => {
  it('returns the identity transformation when the selection is the full range', () => {
    const xScale = scaleTime()
      .range([0, 1])
      .domain([new Date(2000), new Date(2001)]);
    const transformation = createBrushTransform({
      xScale,
      xScaleOriginal: xScale,
      xSelectedPixelMin: 0,
      xSelectedPixelMax: 1,
      movement: CHART_CONFIG.movement,
    });
    expect(transformation.apply([0.5, 0.5])[0]).toEqual(0.5);
    expect(transformation.apply([0, 1])[0]).toEqual(0);
  });

  it('translates to a selection', () => {
    const xScale = scaleTime()
      .domain([new Date(2000, 0, 0), new Date(2001, 0, 0)])
      .range([0, 1]);
    const transformation = createBrushTransform({
      xScale,
      xScaleOriginal: xScale.copy(),
      xSelectedPixelMin: 0.5,
      xSelectedPixelMax: 1.5,
      movement: CHART_CONFIG.movement,
    });
    expect(transformation.apply([0.5, 1])[0]).toEqual(0);
    expect(transformation.apply([1.5, 1])[0]).toEqual(1);
  });

  it('scales a selection', () => {
    const xScale = scaleTime()
      .range([0, 1])
      .domain([new Date(2000, 0, 0), new Date(2001, 0, 0)]);
    const transformation = createBrushTransform({
      xScale,
      xScaleOriginal: xScale,
      xSelectedPixelMin: 0,
      xSelectedPixelMax: 0.5,
      movement: CHART_CONFIG.movement,
    });
    expect(transformation.apply([0, 1])[0]).toEqual(0);
    expect(transformation.apply([1, 1])[0]).toEqual(2);
    expect(transformation.apply([0.5, 1])[0]).toEqual(1);
  });

  it('scales and transforms a selection', () => {
    const xScale = scaleTime()
      .range([0, 1])
      .domain([new Date(2000, 0, 0), new Date(2001, 0, 0)]);
    const transformation = createBrushTransform({
      xScale,
      xScaleOriginal: xScale,
      xSelectedPixelMin: 1,
      xSelectedPixelMax: 1.5,
      movement: CHART_CONFIG.movement,
    });
    expect(transformation.apply([1, 1])[0]).toEqual(0);
    expect(transformation.apply([1.5, 1])[0]).toEqual(1);
    expect(transformation.apply([1.25, 1])[0]).toEqual(0.5);
  });

  describe('chart config zoom constraints', () => {
    it('prevents scaling past the zoom max', () => {
      const xScale = scaleTime()
        .range([0, 1])
        .domain([new Date(2000, 0, 0), new Date(2001, 0, 0)]);
      const transformation = createBrushTransform({
        xScale,
        xScaleOriginal: xScale,
        xSelectedPixelMin: 0,
        xSelectedPixelMax: 0.1,
        movement: {
          ...CHART_CONFIG.movement,
          zoomMax: 2,
        },
      });
      expect(transformation.apply([0.5, 1])[0]).toEqual(1);
      expect(transformation.apply([1, 1])[0]).toEqual(2);
    });

    it('prevents scaling below the zoom min', () => {
      const xScale = scaleTime()
        .range([0, 1])
        .domain([new Date(2000, 0, 0), new Date(2001, 0, 0)]);
      const transformation = createBrushTransform({
        xScale,
        xScaleOriginal: xScale,
        xSelectedPixelMin: 0,
        xSelectedPixelMax: 100,
        movement: {
          ...CHART_CONFIG.movement,
          zoomMin: 0.5,
        },
      });
      expect(transformation.apply([0.5, 1])[0]).toEqual(0.25);
      expect(transformation.apply([1, 1])[0]).toEqual(0.5);
    });
  });
});
