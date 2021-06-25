import { needsNewClipSpace, clipSpaceConversion } from './clipSpaceConversion';
import { DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS, SECOND_IN_MS, YEAR_IN_MS } from '../../../utils/time';

const FLOATING_POINT_SIG_FIGS = 7;

describe('model space conversion', () => {
  it('for a small viewport window, the distance between two converted positions is the difference in time in milliseconds', () => {
    const viewPort = {
      start: new Date(2020, 0, 0, 0, 0, 0),
      end: new Date(2020, 0, 0, 0, 0, 10),
      yMin: 0,
      yMax: 100,
    };

    const toClipSpace = clipSpaceConversion(viewPort);

    const DISTANCE_MS = 35;
    const dateA = new Date(2020, 0, 0, 0, 0, 0, 0);
    const dateB = new Date(2020, 0, 0, 0, 0, 0, DISTANCE_MS);

    expect(toClipSpace(dateB.getTime()) - toClipSpace(dateA.getTime())).toEqual(DISTANCE_MS);
  });

  describe.each`
    start                                             | end
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 0, 0, 0, 0, 100).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 0, 0, 0, 10, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 0, 0, 1, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 0, 0, 10, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 0, 1, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 0, 10, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 1, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 7, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 0, 14, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 1, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 3, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 6, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2000, 9, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2001, 0, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2001, 6, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2002, 0, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2005, 0, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2010, 0, 0, 0, 0, 0, 0).toISOString()}
    ${new Date(2000, 0, 0, 0, 0, 0, 0).toISOString()} | ${new Date(2100, 0, 0, 0, 0, 0, 0).toISOString()}
  `('converts the time within the viewport to be representable by floating points', ({ start, end }) => {
    // NOTE: yMin and yMax don't effect the conversion
    const viewPort = { start: new Date(start), end: new Date(end), yMin: 0, yMax: 100 };
    const toClipSpace = clipSpaceConversion(viewPort);
    describe.each`
      percentage
      ${-0.1}
      ${0}
      ${0.25}
      ${0.5}
      ${0.75}
      ${1}
      ${1.1}
    `(`given viewport from ( ${start} -> ${end} )`, ({ percentage }) => {
      test(`at ${percentage * 100}% of the viewport, have the position representable by a float`, () => {
        const pointInTime = viewPort.start.getTime() + (viewPort.start.getTime() - viewPort.end.getTime()) * percentage;

        // expect(needsNewClipSpace(viewPort, toClipSpace)).toBeFalse();
        expect(Math.abs(toClipSpace(pointInTime))).toBeLessThan(10 ** FLOATING_POINT_SIG_FIGS);
      });
    });
  });
});

describe('whether we need a new clip space provided', () => {
  it('the view port used to create the model space conversion function is always in bounds', () => {
    const viewPort = { start: new Date(2000, 0), end: new Date(2001, 0), yMin: 0, yMax: 100 };
    const toClipSpace = clipSpaceConversion(viewPort);

    expect(needsNewClipSpace(viewPort, toClipSpace)).toBeFalse();
  });

  it('a view port which is translated a far distance from the original view port is out of bounds', () => {
    const viewPort = { start: new Date(2000, 0), end: new Date(2000, 0, 1), yMin: 0, yMax: 100 };
    const newViewPort = { start: new Date(2010, 0), end: new Date(2010, 0, 1), yMin: 0, yMax: 100 };
    const toClipSpace = clipSpaceConversion(viewPort);

    expect(needsNewClipSpace(newViewPort, toClipSpace)).toBeTrue();
  });

  it('a view port which is scaled out a far distance from the original view port is out of bounds', () => {
    const viewPort = { start: new Date(2000, 0), end: new Date(2000, 0, 1), yMin: 0, yMax: 100 };
    const newViewPort = { start: new Date(1999, 0), end: new Date(2002, 0), yMin: 0, yMax: 100 };
    const toClipSpace = clipSpaceConversion(viewPort);

    expect(needsNewClipSpace(newViewPort, toClipSpace)).toBeTrue();
  });

  describe.each`
    duration
    ${1}
    ${10}
    ${SECOND_IN_MS}
    ${10 * MINUTE_IN_MS}
    ${HOUR_IN_MS}
    ${DAY_IN_MS}
    ${7 * DAY_IN_MS}
    ${YEAR_IN_MS}
    ${30 * YEAR_IN_MS}
  `('should not need a new clip space when viewport has not changed', ({ duration }) => {
    test(`given a viewport with duration of ${duration / SECOND_IN_MS} seconds`, () => {
      const viewPort = {
        start: new Date(),
        end: new Date(new Date().getTime() + duration),
        yMin: 0,
        yMax: 100,
      };
      const toClipSpace = clipSpaceConversion(viewPort);
      expect(needsNewClipSpace(viewPort, toClipSpace)).toBeFalse();
    });
  });
});
