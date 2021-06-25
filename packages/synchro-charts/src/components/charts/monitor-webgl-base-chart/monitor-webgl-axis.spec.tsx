import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components.d';
import { update } from '../common/tests/merge';
import { MonitorWebglAxis } from './monitor-webgl-axis';
import { CustomHTMLElement } from '../../../utils/types';
import { renderAxis, AxisRendererProps } from './renderAxis';
import { ViewPort } from '../../../utils/dataTypes';

const WIDTH = 200;
const HEIGHT = 100;

const SIZE_CONFIG = {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  width: WIDTH,
  height: HEIGHT,
};

const VIEWPORT: ViewPort = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 2, 0),
  yMin: 3000,
  yMax: 3100,
};

const axisSpecPage = async (axisRendererProps?: Partial<AxisRendererProps>) => {
  const page = await newSpecPage({
    components: [MonitorWebglAxis],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const axis = page.doc.createElement('monitor-webgl-axis') as CustomHTMLElement<Components.MonitorWebglAxis>;

  const props: Components.MonitorWebglAxis = {
    size: SIZE_CONFIG,
  };
  update(axis, props);
  page.body.appendChild(axis);
  await page.waitForChanges();

  const axisRenderer = renderAxis();
  axisRenderer({
    container: axis.querySelector('svg.axis') as SVGElement,
    size: SIZE_CONFIG,
    viewPort: VIEWPORT,
    ...axisRendererProps,
  });

  await page.waitForChanges();
  return { page, axis, axisRenderer };
};

describe('initial render', () => {
  it('has an x and y axis', async () => {
    const { axis } = await axisSpecPage();
    expect(axis.querySelector('.axis')).not.toBeNull();
    expect(axis.querySelector('.x-axis')).not.toBeNull();
    expect(axis.querySelector('.x-axis-separator')).not.toBeNull();
    expect(axis.querySelector('.y-axis')).not.toBeNull();
    expect(axis.querySelector('.y-axis-label')).toBeNull();
  });

  it('does not render x axis if showX is false', async () => {
    const { axis } = await axisSpecPage({
      axis: {
        showX: false,
      },
    });

    expect(axis.querySelector('.axis')).not.toBeNull();
    expect(axis.querySelector('.x-axis')).toBeNull();
    expect(axis.querySelector('.x-axis-separator')).toBeNull();
    expect(axis.querySelector('.y-axis')).not.toBeNull();
  });

  it('does not render y axis if showY is false', async () => {
    const { axis } = await axisSpecPage({
      axis: {
        showY: false,
      },
    });

    expect(axis.querySelector('.axis')).not.toBeNull();
    expect(axis.querySelector('.x-axis')).not.toBeNull();
    expect(axis.querySelector('.x-axis-separator')).not.toBeNull();
    expect(axis.querySelector('.y-axis')).toBeNull();
  });

  it('renders the y axis separator correctly', async () => {
    const { axis } = await axisSpecPage({
      size: SIZE_CONFIG,
    });

    const xAxisSeparator = axis.querySelector('.x-axis-separator') as SVGLineElement;

    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('x1', SIZE_CONFIG.marginLeft.toString());
    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('x2', (SIZE_CONFIG.marginLeft + SIZE_CONFIG.width).toString());

    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('y1', (SIZE_CONFIG.marginTop + SIZE_CONFIG.height).toString());
    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('y2', (SIZE_CONFIG.marginTop + SIZE_CONFIG.height).toString());
  });

  it('has the correct width and height', async () => {
    const { axis } = await axisSpecPage();
    // @ts-ignore - _styles is a weird stencil thing.
    // eslint-disable-next-line no-underscore-dangle
    const styles = (axis.querySelector('svg') as SVGElement).style._styles;
    expect(styles.get('width')).toEqual(`${WIDTH}px`);
    expect(styles.get('height')).toEqual(`${HEIGHT}px`);
  });

  it('has expected x-axis date labels', async () => {
    const { axis } = await axisSpecPage();
    expect(axis.innerHTML).not.toContain('1999');
    expect(axis.innerHTML).toContain('2000');
    expect(axis.innerHTML).toContain('2001');
    expect(axis.innerHTML).not.toContain('2002');
  });

  it('has expected y axis value labels', async () => {
    const { axis } = await axisSpecPage();
    expect(axis.innerHTML).toContain('3,000');
    expect(axis.innerHTML).not.toContain('3,025');
    expect(axis.innerHTML).toContain('3,050');
    expect(axis.innerHTML).not.toContain('3,075');
    expect(axis.innerHTML).toContain('3,100');
  });

  it('renders the y-axis label', async () => {
    const props = { axis: { labels: { yAxis: { content: 'my cool label' } } } };
    const { axis } = await axisSpecPage(props);
    expect(axis.querySelector('.axis')).not.toBeNull();
    expect(axis.querySelector('.x-axis')).not.toBeNull();
    expect(axis.querySelector('.x-axis-separator')).not.toBeNull();
    expect(axis.querySelector('.y-axis')).not.toBeNull();
    expect(axis.querySelector('.y-axis-label')).not.toBeNull();
    // @ts-ignore
    expect(axis.querySelector('.y-axis-label').textContent).toEqual('my cool label');
  });
});

describe('updated correctly', () => {
  it('has the correct width and height', async () => {
    const { axis, page } = await axisSpecPage();
    const NEW_HEIGHT = 500;
    const NEW_WIDTH = 550;
    const updatedProps: Partial<Components.MonitorWebglAxis> = {
      size: {
        ...SIZE_CONFIG,
        width: NEW_WIDTH,
        height: NEW_HEIGHT,
      },
    };
    update(axis, updatedProps);
    await page.waitForChanges();
    // @ts-ignore - _styles is a weird stencil thing.
    // eslint-disable-next-line no-underscore-dangle
    const styles = (axis.querySelector('svg') as SVGElement).style._styles;
    expect(styles.get('width')).toEqual(`${NEW_WIDTH}px`);
    expect(styles.get('height')).toEqual(`${NEW_HEIGHT}px`);
  });

  it('updates the y axis separator correctly', async () => {
    const { axis, page } = await axisSpecPage({
      size: SIZE_CONFIG,
    });

    const NEW_MARGIN_LEFT = 42;
    const NEW_MARGIN_RIGHT = 82;
    const NEW_MARGIN_TOP = 145;
    const NEW_HEIGHT = 500;
    const NEW_WIDTH = 550;

    update(axis, {
      size: {
        ...SIZE_CONFIG,
        marginLeft: NEW_MARGIN_LEFT,
        marginRight: NEW_MARGIN_RIGHT,
        marginTop: NEW_MARGIN_TOP,
        width: NEW_WIDTH,
        height: NEW_HEIGHT,
      },
    });
    await page.waitForChanges();

    const xAxisSeparator = axis.querySelector('.x-axis-separator') as SVGLineElement;

    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('x1', NEW_MARGIN_LEFT.toString());
    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('x2', (NEW_MARGIN_LEFT + NEW_WIDTH).toString());

    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('y1', (NEW_MARGIN_TOP + NEW_HEIGHT).toString());
    // @ts-ignore
    expect(xAxisSeparator).toHaveAttribute('y2', (NEW_MARGIN_TOP + NEW_HEIGHT).toString());
  });

  it('has expected x-axis date labels', async () => {
    const { axis, page, axisRenderer } = await axisSpecPage();
    axisRenderer({
      container: axis.querySelector('svg.axis') as SVGElement,
      size: SIZE_CONFIG,
      viewPort: {
        ...VIEWPORT,
        start: new Date(1995, 0, 0),
        end: new Date(1997, 0, 0),
      },
    });

    await page.waitForChanges();

    // Old Labels are gone
    expect(axis.innerHTML).not.toContain('2000');
    expect(axis.innerHTML).not.toContain('2001');

    // New Labels are present
    expect(axis.innerHTML).not.toContain('1994');
    expect(axis.innerHTML).toContain('1995');
    expect(axis.innerHTML).toContain('1996');
    expect(axis.innerHTML).not.toContain('1997');
  });

  it('has expected y axis value labels', async () => {
    const { axis, page, axisRenderer } = await axisSpecPage();
    axisRenderer({
      container: axis.querySelector('svg.axis') as SVGElement,
      size: SIZE_CONFIG,
      viewPort: {
        ...VIEWPORT,
        yMin: 4000,
        yMax: 5000,
      },
    });

    await page.waitForChanges();

    // Does not contain old y labels
    expect(axis.innerHTML).not.toContain('3,000');
    expect(axis.innerHTML).not.toContain('3,050');
    expect(axis.innerHTML).not.toContain('3,100');

    // Does contain new y labels
    expect(axis.innerHTML).toContain('4,000');
    expect(axis.innerHTML).toContain('4,500');
    expect(axis.innerHTML).toContain('5,000');
  });

  it('updates the y-axis label', async () => {
    const props = { axis: { labels: { yAxis: { content: 'label-1' } } } };
    const { axis, page, axisRenderer } = await axisSpecPage(props);
    // @ts-ignore
    expect(axis.querySelector('.y-axis-label').textContent).toEqual('label-1');

    axisRenderer({
      container: axis.querySelector('svg.axis') as SVGElement,
      size: SIZE_CONFIG,
      viewPort: {
        ...VIEWPORT,
        yMin: 4000,
        yMax: 5000,
      },
      axis: {
        labels: {
          yAxis: {
            content: 'label-2',
          },
        },
      },
    });

    await page.waitForChanges();

    expect(axis.querySelector('.y-axis-label')!.textContent).toEqual('label-2');
  });
});
