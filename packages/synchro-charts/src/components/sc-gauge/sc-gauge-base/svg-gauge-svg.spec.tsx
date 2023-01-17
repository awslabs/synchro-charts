import { newSpecPage } from '@stencil/core/testing';
import { arc, DefaultArcObject } from 'd3-shape';
import { Components } from '../../../components';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../../charts/common/tests/merge';
import { round } from '../../../utils/number';
import { COMPARISON_OPERATOR, DataType, StatusIcon } from '../../../constants';
import { ColorConfigurations } from '../../common/constants';
import { ScGaugeSvg } from './sc-gauge-svg';
import { ScGaugeLoading } from './sc-gauge-loading';
import { DIAMETER } from '../utils/util';

const PERCENT = 0.5;
const THRESHOLD_COLOR = '#C03F25';

const POINT = {
  x: new Date(1999, 0, 0).getTime(),
  y: 100,
};

const DATA_STREAM = {
  id: 'test-gauge-id',
  name: 'data-stream-name',
  color: '',
  resolution: 0,
  dataType: DataType.NUMBER,
  unit: '',
  data: [POINT],
};

const SIZE = {
  fontSize: 70,
  gaugeThickness: 30,
  iconSize: 50,
  labelSize: 30,
  unitSize: 30,
};

const THRESHOLD = {
  color: THRESHOLD_COLOR,
  value: 1650,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
  dataStreamIds: ['car-speed-alarm'],
  label: {
    text: 'Critical',
    show: true,
  },
  icon: StatusIcon.ERROR,
};

const newValueSpecPage = async (props: Partial<Components.ScGaugeSvg> = {}) => {
  const page = await newSpecPage({
    components: [ScGaugeSvg, ScGaugeLoading],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const gaugeSvg = page.doc.createElement('sc-gauge-svg') as CustomHTMLElement<Components.ScGaugeSvg>;
  update(gaugeSvg, { percent: 0, isLoading: false, unit: '', ...props });
  page.body.appendChild(gaugeSvg);

  await page.waitForChanges();

  return { page, gaugeSvg };
};

it('renders loading component when isLoading is true', async () => {
  const { gaugeSvg } = await newValueSpecPage({
    isLoading: true,
    loadingText: 'Loading',
  });

  const gaugeLoading = gaugeSvg.querySelectorAll('sc-gauge-loading');
  expect(gaugeLoading.length).toBe(1);
});

describe('renders normal component when has changed value', () => {
  it('show value `-` when point is null', async () => {
    const { gaugeSvg } = await newValueSpecPage();

    expect(gaugeSvg.textContent).toBe('-');
  });

  it('show normal value when point provided', async () => {
    const unit = '%';
    const value = round(PERCENT * 100);
    const { gaugeSvg } = await newValueSpecPage({
      point: POINT,
      stream: DATA_STREAM,
      percent: PERCENT,
      value,
      unit,
    });

    expect(gaugeSvg.textContent).toBe(`${value}${unit}`);
  });
});

describe('renders normal component when has changed value', () => {
  it('show value `-` when point is null', async () => {
    const { gaugeSvg } = await newValueSpecPage();

    expect(gaugeSvg.textContent).toBe('-');
  });

  it('show normal value when point provided', async () => {
    const unit = '%';
    const value = round(PERCENT * 100);
    const { gaugeSvg } = await newValueSpecPage({
      point: POINT,
      value,
      stream: DATA_STREAM,
      percent: PERCENT,
      unit,
    });

    expect(gaugeSvg.textContent).toBe(`${value}${unit}`);
  });
});

describe('renders normal component when has changed size', () => {
  const RADIAN = Math.PI / 180;
  const CORNER_RADIUS = 4;
  const unitRadian = Math.PI * 2 * (220 / 360);
  const angleColor = unitRadian * PERCENT;
  const angleDefault = unitRadian * (1 - PERCENT);
  const currentAngle = RADIAN;
  const endAngleColor = currentAngle + angleColor;
  const endAngleDefault = endAngleColor + angleDefault;
  const colorArc = arc()
    .cornerRadius(CORNER_RADIUS)
    .startAngle(currentAngle)
    .endAngle(endAngleColor);
  const defaultArc = arc()
    .cornerRadius(CORNER_RADIUS)
    .startAngle(endAngleDefault)
    .endAngle(endAngleColor);

  it('does specify font size, icon size, thickness, label size and unit size when size provided', async () => {
    const UNIT = '%';
    const { gaugeSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
    });
    const texts = gaugeSvg.querySelectorAll('text');
    expect(texts.length).toBe(2);

    const value = texts[0].attributes.getNamedItem('font-size')?.value;
    expect(value).toEqual(`${SIZE.fontSize}`);

    const label = texts[1].attributes.getNamedItem('font-size')?.value;
    expect(label).toEqual(`${SIZE.labelSize}`);

    const unit = gaugeSvg.querySelectorAll('tspan')[1].attributes.getNamedItem('font-size')?.value;
    expect(unit).toEqual(`${SIZE.unitSize}`);

    const iconWidth = gaugeSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('width')?.value;
    const iconHeight = gaugeSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('height')?.value;
    expect(iconWidth).toEqual(`${SIZE.iconSize}px`);
    expect(iconHeight).toEqual(`${SIZE.iconSize}px`);

    const ringD: DefaultArcObject = {
      innerRadius: DIAMETER,
      outerRadius: DIAMETER - SIZE.gaugeThickness,
      padAngle: RADIAN / 2,
      startAngle: 0,
      endAngle: 0,
    };

    expect(colorArc(ringD)).toContain(DIAMETER - SIZE.gaugeThickness);
    expect(defaultArc(ringD)).toContain(DIAMETER - SIZE.gaugeThickness);
  });

  it('does default specify font size, icon size, thickness, label size and unit size when no size provided', async () => {
    const UNIT = '%';
    const FONT_SIZE = 48;
    const ICON_SIZE = 24;
    const LABEL_SIZE = 24;
    const UNIT_SIZE = 24;
    const GAUGE_THICKNESS = 34;
    const { gaugeSvg } = await newValueSpecPage({
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
      size: {
        fontSize: FONT_SIZE,
        iconSize: ICON_SIZE,
        labelSize: LABEL_SIZE,
        unitSize: UNIT_SIZE,
        gaugeThickness: GAUGE_THICKNESS,
      },
    });
    const texts = gaugeSvg.querySelectorAll('text');
    expect(texts.length).toBe(2);

    const value = texts[0].attributes.getNamedItem('font-size')?.value;
    expect(value).toEqual(`${FONT_SIZE}`);

    const label = texts[1].attributes.getNamedItem('font-size')?.value;
    expect(label).toEqual(`${LABEL_SIZE}`);

    const unit = gaugeSvg.querySelectorAll('tspan')[1].attributes.getNamedItem('font-size')?.value;
    expect(unit).toEqual(`${UNIT_SIZE}`);

    const iconWidth = gaugeSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('width')?.value;
    const iconHeight = gaugeSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('height')?.value;
    expect(iconWidth).toEqual(`${ICON_SIZE}px`);
    expect(iconHeight).toEqual(`${ICON_SIZE}px`);

    const ringD: DefaultArcObject = {
      innerRadius: DIAMETER,
      outerRadius: DIAMETER - GAUGE_THICKNESS,
      padAngle: RADIAN / 2,
      startAngle: 0,
      endAngle: 0,
    };

    expect(colorArc(ringD)).toContain(GAUGE_THICKNESS);
    expect(defaultArc(ringD)).toContain(GAUGE_THICKNESS);
  });
});

describe('renders normal component when has changed color', () => {
  it('does specify color with `blue` when no breachedThreshold provided and no data stream color', async () => {
    const UNIT = '%';
    const { gaugeSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
    });
    const path = gaugeSvg.querySelectorAll('path')[1]?.attributes.getNamedItem('fill')?.value;
    expect(path).toEqual(ColorConfigurations.BLUE);
  });

  it('does specify color with data stream color when data stream color provided and no breachedThreshold provided ', async () => {
    const UNIT = '%';
    const COLOR = '#000';
    const { gaugeSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: { ...DATA_STREAM, color: COLOR },
      unit: UNIT,
    });
    const path = gaugeSvg.querySelectorAll('path')[1]?.attributes.getNamedItem('fill')?.value;
    expect(path).toEqual(COLOR);
  });

  it('does specify color with `breachedThreshold` color when breachedThreshold provided', async () => {
    const UNIT = '%';
    const { gaugeSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
    });
    const path = gaugeSvg.querySelectorAll('path')[1]?.attributes.getNamedItem('fill')?.value;
    expect(path).toEqual(THRESHOLD_COLOR);

    const label = gaugeSvg.querySelectorAll('text')[1].attributes.getNamedItem('fill')?.value;
    expect(label).toEqual(THRESHOLD_COLOR);

    const icon = gaugeSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('fill')?.value;
    expect(icon).toEqual(THRESHOLD_COLOR);
  });

  it('does specify outer ring when outerRingRange provided', async () => {
    const outerRingRange = [
      { percent: 0, value: 0, color: '#fff', showValue: 0 },
      { percent: 0.66, value: 3300, color: '#3F7E23', showValue: 3300 },
      { percent: 0.8, value: 4000, color: '#F29D38', showValue: 4000 },
      { percent: 1, value: 4000, color: '#C03F25', showValue: 5000 },
    ];
    const UNIT = '%';
    const { gaugeSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
      outerRingRange,
    });

    const paths = gaugeSvg.querySelectorAll('path');
    const innerRingAmount = 2;
    const iconAmount = 2;
    const pathAmount = innerRingAmount + outerRingRange.length + iconAmount;
    expect(paths.length).toEqual(pathAmount);

    for (let i = 2; i < pathAmount - iconAmount; i += 1) {
      const path = paths[i]?.attributes.getNamedItem('fill')?.value;
      expect(path).toEqual(outerRingRange[i - 2].color);
    }
  });
});
