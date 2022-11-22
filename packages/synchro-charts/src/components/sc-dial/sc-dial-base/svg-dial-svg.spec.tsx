import { newSpecPage } from '@stencil/core/testing';
import { arc, DefaultArcObject } from 'd3-shape';
import { Components } from '../../../components';
import { CustomHTMLElement } from '../../../utils/types';
import { ScDialSvg } from './sc-dial-svg';
import { update } from '../../charts/common/tests/merge';
import { round } from '../../../utils/number';
import { COMPARISON_OPERATOR, DataType, StatusIcon } from '../../../constants';
import { ScDialLoading } from './sc-dial-loading';
import { ColorConfigurations } from '../../common/constants';

const PERCENT = 0.5;
const THRESHOLD_COLOR = '#C03F25';
const DIAMETER = 138;

const POINT = {
  x: new Date(1999, 0, 0).getTime(),
  y: 100,
};

const DATA_STREAM = {
  id: 'test-dial-id',
  name: 'data-stream-name',
  color: 'black',
  resolution: 0,
  dataType: DataType.NUMBER,
  unit: '',
  data: [POINT],
};

const SIZE = {
  fontSize: 70,
  dialThickness: 30,
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

const newValueSpecPage = async (props: Partial<Components.ScDialSvg> = {}) => {
  const page = await newSpecPage({
    components: [ScDialSvg, ScDialLoading],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dialSvg = page.doc.createElement('sc-dial-svg') as CustomHTMLElement<Components.ScDialSvg>;
  update(dialSvg, { percent: 0, isLoading: false, unit: '', ...props });
  page.body.appendChild(dialSvg);

  await page.waitForChanges();

  return { page, dialSvg };
};

it('renders loading component when isLoading is true', async () => {
  const { dialSvg } = await newValueSpecPage({
    isLoading: true,
    loadingText: 'Loading',
  });

  const dialLoading = dialSvg.querySelectorAll('sc-dial-loading');
  expect(dialLoading.length).toBe(1);
});

describe('renders normal component when has changed value', () => {
  it('show value `-` when point is null', async () => {
    const { dialSvg } = await newValueSpecPage();

    expect(dialSvg.textContent).toBe('-');
  });

  it('show normal value when point provided', async () => {
    const unit = '%';
    const value = round(PERCENT * 100);
    const { dialSvg } = await newValueSpecPage({
      point: POINT,
      stream: DATA_STREAM,
      percent: PERCENT,
      value,
      unit,
    });

    expect(dialSvg.textContent).toBe(`${value}${unit}`);
  });
});

describe('renders normal component when has changed value', () => {
  it('show value `-` when point is null', async () => {
    const { dialSvg } = await newValueSpecPage();

    expect(dialSvg.textContent).toBe('-');
  });

  it('show normal value when point provided', async () => {
    const unit = '%';
    const value = round(PERCENT * 100);
    const { dialSvg } = await newValueSpecPage({
      point: POINT,
      value,
      stream: DATA_STREAM,
      percent: PERCENT,
      unit,
    });

    expect(dialSvg.textContent).toBe(`${value}${unit}`);
  });
});

describe('renders normal component when has changed size', () => {
  const RADIAN = Math.PI / 180;
  const CORNER_RADIUS = 4;
  const unitRadian = Math.PI * 2;
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
    const { dialSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
    });
    const texts = dialSvg.querySelectorAll('text');
    expect(texts.length).toBe(2);

    const value = texts[0].attributes.getNamedItem('font-size')?.value;
    expect(value).toEqual(`${SIZE.fontSize}`);

    const label = texts[1].attributes.getNamedItem('font-size')?.value;
    expect(label).toEqual(`${SIZE.labelSize}`);

    const unit = dialSvg.querySelectorAll('tspan')[1].attributes.getNamedItem('font-size')?.value;
    expect(unit).toEqual(`${SIZE.unitSize}`);

    const iconWidth = dialSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('width')?.value;
    const iconHeight = dialSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('height')?.value;
    expect(iconWidth).toEqual(`${SIZE.iconSize}px`);
    expect(iconHeight).toEqual(`${SIZE.iconSize}px`);

    const ringD: DefaultArcObject = {
      innerRadius: DIAMETER,
      outerRadius: DIAMETER - SIZE.dialThickness,
      padAngle: RADIAN / 2,
      startAngle: 0,
      endAngle: 0,
    };

    expect(colorArc(ringD)).toContain(DIAMETER - SIZE.dialThickness);
    expect(defaultArc(ringD)).toContain(DIAMETER - SIZE.dialThickness);
  });

  it('does default specify font size, icon size, thickness, label size and unit size when no size provided', async () => {
    const UNIT = '%';
    const FONT_SIZE = 48;
    const ICON_SIZE = 24;
    const LABEL_SIZE = 24;
    const UNIT_SIZE = 24;
    const DIAL_THICKNESS = 34;
    const { dialSvg } = await newValueSpecPage({
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
        dialThickness: DIAL_THICKNESS,
      },
    });
    const texts = dialSvg.querySelectorAll('text');
    expect(texts.length).toBe(2);

    const value = texts[0].attributes.getNamedItem('font-size')?.value;
    expect(value).toEqual(`${FONT_SIZE}`);

    const label = texts[1].attributes.getNamedItem('font-size')?.value;
    expect(label).toEqual(`${LABEL_SIZE}`);

    const unit = dialSvg.querySelectorAll('tspan')[1].attributes.getNamedItem('font-size')?.value;
    expect(unit).toEqual(`${UNIT_SIZE}`);

    const iconWidth = dialSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('width')?.value;
    const iconHeight = dialSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('height')?.value;
    expect(iconWidth).toEqual(`${ICON_SIZE}px`);
    expect(iconHeight).toEqual(`${ICON_SIZE}px`);

    const ringD: DefaultArcObject = {
      innerRadius: DIAMETER,
      outerRadius: DIAMETER - DIAL_THICKNESS,
      padAngle: RADIAN / 2,
      startAngle: 0,
      endAngle: 0,
    };

    expect(colorArc(ringD)).toContain(DIAL_THICKNESS);
    expect(defaultArc(ringD)).toContain(DIAL_THICKNESS);
  });
});

describe('renders normal component when has changed color', () => {
  it('does specify color with `blue` when no breachedThreshold provided', async () => {
    const UNIT = '%';
    const { dialSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
    });
    const path = dialSvg.querySelectorAll('path')[1]?.attributes.getNamedItem('fill')?.value;
    expect(path).toEqual(ColorConfigurations.BLUE);
  });

  it('does specify color with `breachedThreshold` color when breachedThreshold provided', async () => {
    const UNIT = '%';
    const { dialSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      value: POINT.y,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
    });
    const path = dialSvg.querySelectorAll('path')[1]?.attributes.getNamedItem('fill')?.value;
    expect(path).toEqual(THRESHOLD_COLOR);

    const label = dialSvg.querySelectorAll('text')[1].attributes.getNamedItem('fill')?.value;
    expect(label).toEqual(THRESHOLD_COLOR);

    const icon = dialSvg.querySelectorAll('svg')[1]?.attributes.getNamedItem('fill')?.value;
    expect(icon).toEqual(THRESHOLD_COLOR);
  });
});
