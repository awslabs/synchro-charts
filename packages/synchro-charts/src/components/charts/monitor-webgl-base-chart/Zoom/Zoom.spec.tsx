import { newSpecPage } from '@stencil/core/testing';

import { scaleLinear, scaleTime } from 'd3-scale';
import { zoomIdentity } from 'd3-zoom';
import { CHART_CONFIG } from '../../common/testUtil';
import Zoom from './Zoom';
import { ScBox } from '../../../../testing/testing-ground/sc-box/sc-box';

const MIN_Y_DOMAIN = 0;
const MAX_Y_DOMAIN = 100;
const MIN_Y = 0;
const MAX_Y = 100;
const MIN_X = 0;
const MAX_X = 100;
const START = new Date(2000, 0, 0);
const END = new Date(2001, 0, 0);

const createZoom = async () => {
  const page = await newSpecPage({
    components: [ScBox], // Stencil requires something to be passed in here.
    html: '<svg />',
  });
  const zoom = new Zoom(
    {
      xScale: scaleTime()
        .domain([START, END])
        .range([MIN_X, MAX_X]),
      yScale: scaleLinear()
        .domain([MIN_Y_DOMAIN, MAX_Y_DOMAIN])
        .range([MIN_Y, MAX_Y]),
    },
    CHART_CONFIG.movement,
    () => (page.root as unknown) as SVGGElement // It's a svg because of line 21.
  );
  zoom.init();
  return zoom;
};

describe('Zoom behavior', () => {
  it('instantiates correctly', () => {
    const zoom = new Zoom({ xScale: scaleTime(), yScale: scaleLinear() }, CHART_CONFIG.movement, () => undefined);
    expect(zoom).toBeDefined();
  });

  it('throws error is initialized while container returns undefined', () => {
    const zoom = new Zoom({ xScale: scaleTime(), yScale: scaleLinear() }, CHART_CONFIG.movement, () => undefined);
    expect(() => zoom.init()).toThrowError('Must not init Zoom before the container is available!');
  });

  describe('updates viewport', () => {
    it(
      'returns the original frame of reference if not transform has been applied ' +
        'and the new frame of reference is the same as the previous frame of reference',
      async () => {
        const zoom = await createZoom();
        const { xScale } = zoom.updateSize({
          xMin: MIN_X,
          xMax: MAX_X,
          yMin: MIN_Y,
          yMax: MAX_Y,
        });
        expect(xScale.domain()).toEqual([START, END]);
        expect(xScale.range()).toEqual([MIN_X, MAX_X]);
      }
    );

    it('returns the scales with matching viewport of the passed in view port', async () => {
      const zoom = await createZoom();
      const newRange = [MIN_X, MAX_X * 2];
      const { xScale } = zoom.updateSize({
        xMin: MIN_X,
        xMax: MAX_X * 2,
        yMin: MIN_Y,
        yMax: MAX_Y,
      });
      expect(xScale.domain()).toEqual([START, END]);
      expect(xScale.range()).toEqual(newRange);
    });

    it(
      'when view port includes a larger width, ' +
        'return xScale with the same x range but with an increased range matching the increase in the view port',
      async () => {
        /**
         * Explanation for humans:
         *
         * We are injecting a transform which represents scrolling one 'horizontal page' to the left (click far right of chart and pan one width worth).
         * This should shift the domain by the duration of the domain (which will be one year in this case).
         *
         * Then we apply a new frame of reference, which updates the viewport width to be twice as large.
         * This should return scales which maintain the same shifted domain, with the new shifted viewport.
         */
        const zoom = await createZoom();
        const X_TRANSLATION = MIN_X - MAX_X; // Shift over an entire domain length (1 year domain shift)
        // @ts-ignore
        // Reach into the internals to set the transform
        zoom.setTransform(zoomIdentity.translate(X_TRANSLATION, 0));

        const { xScale } = zoom.updateSize({
          xMin: MIN_X,
          xMax: MAX_X * 2,
          yMin: MIN_Y,
          yMax: MAX_Y,
        });
        expect(xScale.range()).toEqual([MIN_X, MAX_X * 2]);
        expect(xScale.domain()).toEqual([new Date(2001, 0, 0), new Date(2002, 0, 1)]);
      }
    );
  });

  describe('update view port', () => {
    it('returns un altered scales if no transformation is applied and view port is not altered', async () => {
      const zoom = await createZoom();
      const Y_MIN = 0;
      const Y_MAX = 100;
      const { xScale, yScale } = zoom.updateViewPort({ start: START, end: END, yMin: Y_MIN, yMax: Y_MAX });
      const [newStartDate, newEndDate] = xScale.domain() as [Date, Date];
      expect(newStartDate.toISOString()).toBe(START.toISOString());
      expect(newEndDate.toISOString()).toBe(END.toISOString());
      expect(newEndDate.toISOString()).toBe(END.toISOString());
      expect(xScale.range()).toEqual([MIN_X, MAX_X]);
      expect(yScale.range()).toEqual([MIN_Y, MAX_Y]);
      expect(yScale.domain()).toEqual([MIN_Y_DOMAIN, MAX_Y_DOMAIN]);
    });

    it('returns translated x scale', async () => {
      const zoom = await createZoom();
      const ALTERED_START_DATE = new Date(2001, 0, 0);
      const ALTERED_END_DATE = new Date(2002, 0, 0);
      const { xScale } = zoom.updateViewPort({
        start: ALTERED_START_DATE,
        end: ALTERED_END_DATE,
        yMin: MIN_Y_DOMAIN,
        yMax: MAX_Y_DOMAIN,
      });
      const [newStartDate, newEndDate] = xScale.domain() as [Date, Date];
      expect(newStartDate.toISOString()).toBe(ALTERED_START_DATE.toISOString());
      expect(newEndDate.toISOString()).toBe(ALTERED_END_DATE.toISOString());
      expect(xScale.range()).toEqual([MIN_X, MAX_X]);
    });

    it('returns scaled x scale', async () => {
      const zoom = await createZoom();
      const ALTERED_START_DATE = new Date(2000, 0, 0);
      const ALTERED_END_DATE = new Date(2001, 0, 0);
      const { xScale } = zoom.updateViewPort({
        start: ALTERED_START_DATE,
        end: ALTERED_END_DATE,
        yMin: MIN_Y_DOMAIN,
        yMax: MAX_Y_DOMAIN,
      });
      const [newStartDate, newEndDate] = xScale.domain() as [Date, Date];
      expect(newStartDate.toISOString()).toBe(ALTERED_START_DATE.toISOString());
      expect(newEndDate.toISOString()).toBe(ALTERED_END_DATE.toISOString());
      expect(xScale.range()).toEqual([MIN_X, MAX_X]);
    });

    it('returns scaled and translated x scale', async () => {
      const zoom = await createZoom();
      const ALTERED_START_DATE = new Date(2002, 0, 0);
      const ALTERED_END_DATE = new Date(2008, 0, 0);
      const { xScale } = zoom.updateViewPort({
        start: ALTERED_START_DATE,
        end: ALTERED_END_DATE,
        yMin: MIN_Y_DOMAIN,
        yMax: MAX_Y_DOMAIN,
      });
      const [newStartDate, newEndDate] = xScale.domain() as [Date, Date];
      expect(newStartDate.toISOString()).toBe(ALTERED_START_DATE.toISOString());
      expect(newEndDate.toISOString()).toBe(ALTERED_END_DATE.toISOString());
      expect(xScale.range()).toEqual([MIN_X, MAX_X]);
    });

    it('returns an updated y scale domain', async () => {
      const zoom = await createZoom();
      const Y_MIN_DOMAIN_ALTERED = 100;
      const Y_MAX_DOMAIN_ALTERED = 10000;
      const { yScale } = zoom.updateViewPort({
        start: START,
        end: END,
        yMin: Y_MIN_DOMAIN_ALTERED,
        yMax: Y_MAX_DOMAIN_ALTERED,
      });
      expect(yScale.domain()).toEqual([Y_MIN_DOMAIN_ALTERED, Y_MAX_DOMAIN_ALTERED]);
    });
  });
});
