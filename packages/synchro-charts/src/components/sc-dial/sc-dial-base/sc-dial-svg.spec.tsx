import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { ScDialSvg } from './sc-dial-svg';
import { update } from '../../charts/common/tests/merge';
import { COMPARISON_OPERATOR, DataType, StatusIcon } from '../../../constants';
import { round } from '../../../utils/number';
import { ColorConfigurations } from '../utils/util';

const PERCENT = 0.5;
const THRESHOLD_COLOR = '#C03F25';

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
    components: [ScDialSvg],
    html: '<div></div>',
    supportsShadowDom: true,
  });
  const dialSvg = page.doc.createElement('sc-dial-svg') as CustomHTMLElement<Components.ScDialSvg>;
  update(dialSvg, { percent: 0, ...props });
  page.body.appendChild(dialSvg);
  await page.waitForChanges();
  const svg = dialSvg.querySelector('svg') as SVGGraphicsElement;
  return { page, dialSvg: svg };
};

describe('value', () => {
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
      unit,
    });

    expect(dialSvg.textContent).toBe(`${value}${unit}`);
  });

  it('show value with 4 digits when significantDigits = 4', async () => {
    const unit = '%';
    const significantDigits = 4;
    const value = (PERCENT * 100).toPrecision(significantDigits);
    const { dialSvg } = await newValueSpecPage({
      point: POINT,
      stream: DATA_STREAM,
      percent: PERCENT,
      unit,
      significantDigits,
    });

    expect(dialSvg.textContent).toBe(`${value}${unit}`);
  });
});

describe('size', () => {
  it('does specify font size, icon size, thickness, label size and unit size when size provided', async () => {
    const UNIT = '%';
    const { dialSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
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

    const circle = dialSvg.querySelector('circle')?.attributes.getNamedItem('stroke-width')?.value;
    expect(circle).toEqual(`${SIZE.dialThickness}`);

    const iconWidth = dialSvg.querySelector('svg')?.attributes.getNamedItem('width')?.value;
    const iconHeight = dialSvg.querySelector('svg')?.attributes.getNamedItem('height')?.value;
    expect(iconWidth).toEqual(`${SIZE.iconSize}px`);
    expect(iconHeight).toEqual(`${SIZE.iconSize}px`);
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
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
    });
    const texts = dialSvg.querySelectorAll('text');
    expect(texts.length).toBe(2);

    const value = texts[0].attributes.getNamedItem('font-size')?.value;
    expect(value).toEqual(`${FONT_SIZE}`);

    const label = texts[1].attributes.getNamedItem('font-size')?.value;
    expect(label).toEqual(`${LABEL_SIZE}`);

    const unit = dialSvg.querySelectorAll('tspan')[1].attributes.getNamedItem('font-size')?.value;
    expect(unit).toEqual(`${UNIT_SIZE}`);

    const circle = dialSvg.querySelector('circle')?.attributes.getNamedItem('stroke-width')?.value;
    expect(circle).toEqual(`${DIAL_THICKNESS}`);

    const iconWidth = dialSvg.querySelector('svg')?.attributes.getNamedItem('width')?.value;
    const iconHeight = dialSvg.querySelector('svg')?.attributes.getNamedItem('height')?.value;
    expect(iconWidth).toEqual(`${ICON_SIZE}px`);
    expect(iconHeight).toEqual(`${ICON_SIZE}px`);
  });
});

describe('color', () => {
  it('does specify color with `blue` when no breachedThreshold provided', async () => {
    const UNIT = '%';
    const { dialSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
    });
    const circle = dialSvg.querySelectorAll('circle')[1]?.attributes.getNamedItem('stroke')?.value;
    expect(circle).toEqual(ColorConfigurations.BLUE);
  });

  it('does specify color with `breachedThreshold` color when breachedThreshold provided', async () => {
    const UNIT = '%';
    const { dialSvg } = await newValueSpecPage({
      size: SIZE,
      percent: PERCENT,
      point: POINT,
      stream: DATA_STREAM,
      unit: UNIT,
      breachedThreshold: THRESHOLD,
    });
    const circle = dialSvg.querySelectorAll('circle')[1]?.attributes.getNamedItem('stroke')?.value;
    expect(circle).toEqual(THRESHOLD_COLOR);

    const label = dialSvg.querySelectorAll('text')[1].attributes.getNamedItem('fill')?.value;
    expect(label).toEqual(THRESHOLD_COLOR);

    const icon = dialSvg.querySelector('svg')?.attributes.getNamedItem('fill')?.value;
    expect(icon).toEqual(THRESHOLD_COLOR);
  });
});
