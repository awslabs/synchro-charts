import { zoomIdentity } from 'd3-zoom';
import { scaleLinear } from 'd3-scale';
import { getTransformedDateRange } from './transformUtil';

const START_DATE = new Date(2000, 0, 0);
const END_DATE = new Date(2001, 0, 0);

const getXScale = () =>
  scaleLinear()
    .domain([START_DATE, END_DATE])
    .range([0, 100]);

describe('getTransformFromDates', () => {
  it.skip('returns identity transformation when date ranges unchanged', () => {
    // TODO: Implement
  });
});

describe('transform date range', () => {
  it('returns date range unchanged when given the identity transformation', () => {
    const { endDate, startDate } = getTransformedDateRange({
      xScale: getXScale(),
      transform: zoomIdentity,
    });
    expect(startDate.toISOString()).toEqual(START_DATE.toISOString());
    expect(endDate.toISOString()).toEqual(END_DATE.toISOString());
  });

  it('returns translated date range', () => {
    const { endDate, startDate } = getTransformedDateRange({
      xScale: getXScale(),
      transform: zoomIdentity.translate(-100, 0),
    });
    expect(startDate.toISOString()).toEqual(new Date(2001, 0, 0).toISOString());
    expect(endDate.toISOString()).toEqual(new Date(2002, 0, 1).toISOString());
  });

  it('returns scaled date range', () => {
    const { endDate, startDate } = getTransformedDateRange({
      xScale: getXScale(),
      transform: zoomIdentity.scale(0.5),
    });
    expect(startDate.toISOString()).toEqual(START_DATE.toISOString());
    expect(endDate.toISOString()).toEqual(new Date(2002, 0, 1).toISOString());
  });

  it('returns scaled and translated date range', () => {
    const { endDate, startDate } = getTransformedDateRange({
      xScale: getXScale(),
      transform: zoomIdentity.translate(-100, 0).scale(2),
    });
    expect(startDate.toISOString()).toEqual(new Date(2000, 6, 1).toISOString());
    expect(endDate.toISOString()).toEqual(new Date(2000, 11, 31).toISOString());
  });
});
