import { zoomIdentity } from 'd3-zoom';
import { scaleLinear } from 'd3-scale';
import { createScales, transformScales } from './scaleUtil';
import { VIEW_PORT, CHART_CONFIG } from '../common/testUtil';
import { ScaleType } from '../common/constants';

describe('scale transformations', () => {
  it('returns scales unchanged if x scroll is disabled', () => {
    const { xScale, yScale } = transformScales(
      zoomIdentity.translate(100, 100).scale(10),
      { enableXScroll: false, enableYScroll: false, zoomMin: 1, zoomMax: 1 },
      {
        xScale: scaleLinear().domain([0, 1]),
        yScale: scaleLinear().domain([0, 1]),
      }
    );
    const [xMinDomain, xMaxDomain] = xScale.domain();
    const [yMinDomain, yMaxDomain] = yScale.domain();
    expect(xMinDomain).toBe(0);
    expect(xMaxDomain).toBe(1);
    expect(yMinDomain).toBe(0);
    expect(yMaxDomain).toBe(1);
  });

  it('scales y scale domain when passed a non-identity transformation and y scroll is enabled', () => {
    const { yScale } = transformScales(
      zoomIdentity.scale(2),
      { enableXScroll: true, enableYScroll: true, zoomMin: 1, zoomMax: 1 },
      {
        xScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
        yScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
      }
    );
    const [yDomainStart, yDomainEnd] = yScale.domain();
    const [yRangeStart, yRangeEnd] = yScale.range();
    expect(yDomainStart).toBeCloseTo(-0.05555, 3);
    expect(yDomainEnd).toBeCloseTo(0.4444, 3);
    expect(yRangeStart).toBe(10);
    expect(yRangeEnd).toBe(100);
  });

  it('translates x scale domain when passed a non-identity transformation and x scroll is enabled', () => {
    const { xScale } = transformScales(
      zoomIdentity.translate(1, 0),
      { enableXScroll: true, enableYScroll: true, zoomMin: 1, zoomMax: 1 },
      {
        xScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
        yScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
      }
    );
    const [xDomainStart, xDomainEnd] = xScale.domain();
    const [xRangeStart, xRangeEnd] = xScale.range();
    expect(xDomainStart).toBeCloseTo(-0.0111, 3);
    expect(xDomainEnd).toBeCloseTo(0.9888, 3);
    expect(xRangeStart).toBe(10);
    expect(xRangeEnd).toBe(100);
  });

  it('returns x scale unchanged when passed the identity transformation', () => {
    const { xScale } = transformScales(
      zoomIdentity,
      { enableXScroll: true, enableYScroll: true, zoomMin: 1, zoomMax: 1 },
      {
        xScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
        yScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
      }
    );
    const [xDomainStart, xDomainEnd] = xScale.domain();
    const [xRangeStart, xRangeEnd] = xScale.range();
    expect(xDomainStart).toBe(0);
    expect(xDomainEnd).toBe(1);
    expect(xRangeStart).toBe(10);
    expect(xRangeEnd).toBe(100);
  });

  it('returns y scale unchanged when passed the identity transformation', () => {
    const { yScale } = transformScales(
      zoomIdentity,
      { enableXScroll: true, enableYScroll: true, zoomMin: 1, zoomMax: 1 },
      {
        xScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
        yScale: scaleLinear()
          .domain([0, 1])
          .range([10, 100]),
      }
    );
    const [yDomainStart, yDomainEnd] = yScale.domain();
    const [yRangeStart, yRangeEnd] = yScale.range();
    expect(yDomainStart).toBe(0);
    expect(yDomainEnd).toBe(1);
    expect(yRangeStart).toBe(10);
    expect(yRangeEnd).toBe(100);
  });
});

const createConfig = ({
  xDomain,
  yDomain,
  xRange,
  yRange,
  scaleType,
}: {
  xDomain: [Date, Date];
  yDomain: [number, number];
  xRange: [number, number];
  yRange: [number, number];
  scaleType: ScaleType;
}) => ({
  scale: {
    ...CHART_CONFIG.scale,
    xScaleType: ScaleType.TimeSeries,
    yScaleType: scaleType,
  },
  size: {
    ...CHART_CONFIG.size,
    width: xRange[1] - xRange[0],
    height: yRange[1] - yRange[0],
  },
  viewPort: {
    start: xDomain[0],
    end: xDomain[1],
    yMin: yDomain[0],
    yMax: yDomain[1],
  },
});

describe('create scales', () => {
  it('creates y linear scale with correct domain and range', () => {
    const X_DOMAIN: [Date, Date] = [new Date(2000, 0, 0), new Date(2001, 0, 0)];
    const X_RANGE: [number, number] = [0, 100];
    const Y_DOMAIN: [number, number] = [0, 10];
    const Y_RANGE: [number, number] = [0, 10];
    const { xScale, yScale } = createScales(
      createConfig({
        scaleType: ScaleType.Linear,
        xDomain: X_DOMAIN,
        xRange: X_RANGE,
        yRange: Y_RANGE,
        yDomain: Y_DOMAIN,
      })
    );
    expect(xScale.domain()).toEqual(X_DOMAIN);
    expect(xScale.range()).toEqual(X_RANGE);
    expect(yScale.domain()).toEqual(Y_DOMAIN);
    // Top left is defined as (0, 0)
    expect(yScale.range()).toEqual(Y_RANGE.reverse());
  });

  it('creates y logarithmic scale with correct domain and range', () => {
    const X_DOMAIN = [new Date(2000, 0, 0), new Date(2001, 0, 0)] as [Date, Date];
    const X_RANGE = [0, 100] as [number, number];
    const Y_DOMAIN = [1, 10] as [number, number];
    const Y_RANGE = [0, 100] as [number, number];
    const { xScale, yScale } = createScales(
      createConfig({ scaleType: ScaleType.Log, xDomain: X_DOMAIN, xRange: X_RANGE, yRange: Y_RANGE, yDomain: Y_DOMAIN })
    );
    expect(xScale.domain()).toEqual(X_DOMAIN);
    expect(xScale.range()).toEqual(X_RANGE);
    expect(yScale.domain()).toEqual(Y_DOMAIN);
    // Top left is defined as (0, 0)
    expect(yScale.range()).toEqual(Y_RANGE.reverse());
  });

  it('throws error when passed invalid scale type', () => {
    expect(() =>
      createScales({
        size: CHART_CONFIG.size,
        viewPort: VIEW_PORT,
        scale: {
          ...CHART_CONFIG.scale,
          xScaleType: 'fake-scale-type' as ScaleType,
          yScaleType: ScaleType.Log,
        },
      })
    ).toThrowError('fake-scale-type');
  });
});
