import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { renderAnnotations, RenderAnnotationsOptions } from './renderAnnotations';
import { YAnnotation } from '../types';
import { SECOND_IN_MS } from '../../../../utils/time';
import { LINE_SELECTOR as X_LINE_SELECTOR } from './XAnnotations/XAnnotationLines';
import { LINE_SELECTOR as Y_LINE_SELECTOR } from './YAnnotations/YAnnotationLines';
import { TEXT_SELECTOR as X_TEXT_SELECTOR } from './XAnnotations/XAnnotationTexts';
import {
  TEXT_SELECTOR as Y_TEXT_SELECTOR,
  TEXT_VALUE_SELECTOR as Y_TEXT_VALUE_SELECTOR,
} from './YAnnotations/YAnnotationTexts';

const VIEWPORT = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  yMin: 0,
  yMax: 100,
};

const SIZE = {
  width: 100,
  height: 50,
};

const render = (props: Partial<RenderAnnotationsOptions>, page: SpecPage) => {
  const defaultProps: RenderAnnotationsOptions = {
    resolution: 0,
    annotations: {},
    container: page.body.querySelector('svg') as SVGElement,
    viewPort: VIEWPORT,
    size: SIZE,
  };

  renderAnnotations({
    ...defaultProps,
    ...props,
  });
};

const newAnnotationsPage = async (props: Partial<RenderAnnotationsOptions>) => {
  const page = await newSpecPage({
    components: [],
    html: '<svg viewBox="0 0 100 50"></svg>',
    supportsShadowDom: false,
  });

  await page.waitForChanges();

  render(props, page);

  await page.waitForChanges();

  return { page };
};

describe('no annotations', () => {
  it('renders no annotations when no annotations provided explicitly', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [],
        y: [],
      },
    });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('renders no annotations when no annotations provided implicitly', async () => {
    const { page } = await newAnnotationsPage({ annotations: {} });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('renders no annotations when show changes to false', async () => {
    const Y_ANNOTATION: YAnnotation = {
      color: 'red',
      showValue: true,
      label: {
        text: 'some y text',
        show: true,
      },
      value: (VIEWPORT.yMax + VIEWPORT.yMin) / 2,
    };
    const X_ANNOTATION = {
      color: 'blue',
      showValue: true,
      label: {
        text: 'some xtext',
        show: true,
      },
      value: new Date((VIEWPORT.start.getTime() + VIEWPORT.end.getTime()) / 2),
    };
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
        y: [Y_ANNOTATION],
        show: true,
      },
    });

    let xLine = page.body.querySelector(X_LINE_SELECTOR);
    let xText = page.body.querySelector(X_TEXT_SELECTOR);
    let yLine = page.body.querySelector(Y_LINE_SELECTOR);
    let yText = page.body.querySelector(Y_TEXT_SELECTOR);
    let yTextValue = page.body.querySelector(Y_TEXT_VALUE_SELECTOR);

    expect(xLine).not.toBeNull();
    expect(xText).not.toBeNull();
    expect(yLine).not.toBeNull();
    expect(yText).not.toBeNull();
    expect(yTextValue).not.toBeNull();

    render(
      {
        annotations: {
          x: [X_ANNOTATION],
          y: [Y_ANNOTATION],
          show: false,
        },
      },
      page
    );

    xLine = page.body.querySelector(X_LINE_SELECTOR);
    xText = page.body.querySelector(X_TEXT_SELECTOR);
    yLine = page.body.querySelector(Y_LINE_SELECTOR);
    yText = page.body.querySelector(Y_TEXT_SELECTOR);
    yTextValue = page.body.querySelector(Y_TEXT_VALUE_SELECTOR);

    expect(xLine).toBeNull();
    expect(xText).toBeNull();
    expect(yLine).toBeNull();
    expect(yText).toBeNull();
    expect(yTextValue).toBeNull();
  });
});

describe('x annotation', () => {
  const X_ANNOTATION = {
    color: 'red',
    showValue: false,
    label: {
      text: 'some text',
      show: true,
    },
    value: new Date((VIEWPORT.start.getTime() + VIEWPORT.end.getTime()) / 2),
  };

  it('renders correctly', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('does not render annotation before the start of the viewport', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          {
            ...X_ANNOTATION,
            value: new Date(VIEWPORT.start.getTime() - SECOND_IN_MS),
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('does not render annotation after the end of the viewport', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          {
            ...X_ANNOTATION,
            value: new Date(VIEWPORT.end.getTime() + SECOND_IN_MS),
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('renders label when annotation is set to show text with correct color', async () => {
    const SOME_LABEL = 'some-label!';
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          {
            ...X_ANNOTATION,
            label: {
              text: SOME_LABEL,
              show: true,
            },
            showValue: false,
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('text.x')).toHaveLength(1);
    const text = page.body.querySelector('text.x') as SVGTextElement;
    expect(text.textContent).toBe(SOME_LABEL);
    expect(text.style.fill).toBe(X_ANNOTATION.color);
  });

  it('updates annotations text and color correctly', async () => {
    const SOME_NEW_LABEL = 'some-label!';
    const NEW_COLOR = 'green';
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          {
            ...X_ANNOTATION,
            label: {
              text: 'some random label',
              show: true,
            },
            showValue: false,
          },
        ],
      },
    });

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              color: NEW_COLOR,
              label: {
                text: SOME_NEW_LABEL,
                show: true,
              },
              showValue: false,
            },
          ],
        },
      },
      page
    );

    const text = page.body.querySelector('text.x') as SVGTextElement;
    expect(text.textContent).toBe(SOME_NEW_LABEL);
    expect(text.style.fill).toBe(NEW_COLOR);
  });

  it('renders value and label when annotation is set to show text and value displayed', async () => {
    const SOME_LABEL = 'some-label!';
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          {
            ...X_ANNOTATION,
            label: {
              text: SOME_LABEL,
              show: true,
            },
            showValue: true,
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('text.x')).toHaveLength(1);
    const text = page.body.querySelector('text.x') as SVGTextElement;
    expect(text.textContent).toBe(`${SOME_LABEL} (7/1/2000)`);
  });

  it('does not render label when annotation is set to not show the label', async () => {
    const SOME_LABEL = 'some-label!';
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          {
            ...X_ANNOTATION,
            label: {
              text: SOME_LABEL,
              show: false,
            },
            showValue: false,
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('text.x')).toBeEmpty();
  });

  it('renders single annotation which is within middle of the viewport vertically', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    const lineX = page.body.querySelector('line.x') as SVGLineElement;

    // Has expected lines
    expect(page.body.querySelectorAll('line.x')).toHaveLength(1);
    expect(page.body.querySelectorAll('line.y')).toBeEmpty();

    // Line bisects the viewport vertically
    expect(lineX.getAttribute('x1')).toEqual((SIZE.width / 2).toString());
    expect(lineX.getAttribute('x2')).toEqual((SIZE.width / 2).toString());
    expect(lineX.getAttribute('y1')).toEqual('0');
    expect(lineX.getAttribute('y2')).toEqual(SIZE.height.toString());
  });

  it('renders initial color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    const lineX = page.body.querySelector('line.x') as SVGLineElement;
    expect(lineX.style.stroke).toBe(X_ANNOTATION.color);
  });

  it('renders updated color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    const UPDATED_COLOR = 'blue';

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              color: UPDATED_COLOR,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    const lineX = page.body.querySelector('line.x') as SVGLineElement;
    expect(lineX.style.stroke).toBe(X_ANNOTATION.color);
  });

  it('deletes annotation when removed', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    render({ annotations: {} }, page);

    await page.waitForChanges();

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('updates position when value is updated', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              value: VIEWPORT.start,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    const lineX = page.body.querySelector('line.x') as SVGLineElement;

    const updatedX = 0;
    expect(lineX.getAttribute('x1')).toEqual(updatedX.toString());
    expect(lineX.getAttribute('x2')).toEqual(updatedX.toString());
  });
});

describe('y annotation', () => {
  const Y_ANNOTATION: YAnnotation = {
    color: 'red',
    showValue: false,
    label: {
      text: 'some text',
      show: true,
    },
    value: (VIEWPORT.yMax + VIEWPORT.yMin) / 2,
  };

  it('renders correctly', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('does not render annotation outside of viewport above yMax', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            value: VIEWPORT.yMax + 1,
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('does not render annotation outside of viewport below yMin', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            value: VIEWPORT.yMin - 1,
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('renders single annotation bisecting the viewport', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    const lineY = page.body.querySelector('line.y') as SVGLineElement;

    // Has expected lines
    expect(page.body.querySelectorAll('line.y')).toHaveLength(1);
    expect(page.body.querySelectorAll('line.x')).toBeEmpty();

    // Line bisects the viewport vertically
    expect(lineY.getAttribute('x1')).toEqual('0');
    expect(lineY.getAttribute('x2')).toEqual(SIZE.width.toString());
    expect(lineY.getAttribute('y1')).toEqual((SIZE.height / 2).toString());
    expect(lineY.getAttribute('y2')).toEqual((SIZE.height / 2).toString());
  });

  it('renders initial color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    const lineY = page.body.querySelector('line.y') as SVGLineElement;
    expect(lineY.style.stroke).toBe(Y_ANNOTATION.color);
  });

  it('renders updated color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    const UPDATED_COLOR = 'blue';

    render(
      {
        annotations: {
          y: [
            {
              ...Y_ANNOTATION,
              color: UPDATED_COLOR,
            },
          ],
        },
      },
      page
    );
    await page.waitForChanges();

    const lineY = page.body.querySelector('line.y') as SVGLineElement;
    expect(lineY.style.stroke).toBe(UPDATED_COLOR);
  });

  it('updates position when value is updated', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    render(
      {
        annotations: {
          y: [
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMax,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    const lineY = page.body.querySelector('line.y') as SVGLineElement;

    const updatedY = 0;
    expect(lineY.getAttribute('y1')).toEqual(updatedY.toString());
    expect(lineY.getAttribute('y2')).toEqual(updatedY.toString());
  });

  it('renders label with annotations color when annotation is set to show text', async () => {
    const SOME_LABEL = 'some-label!';
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            label: {
              text: SOME_LABEL,
              show: true,
            },
            showValue: false,
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('text.y')).toHaveLength(1);
    const text = page.body.querySelector('text.y') as SVGTextElement;
    expect(text.textContent).toBe(SOME_LABEL);
    expect(text.style.fill).toBe(Y_ANNOTATION.color);
  });

  it('renders value and label when annotation is set to show text and value displayed', async () => {
    const SOME_LABEL = 'some-label!';
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            label: {
              text: SOME_LABEL,
              show: true,
            },
            showValue: true,
          },
        ],
      },
    });

    expect(page.body.querySelectorAll('text.y').length).toBe(1);
    expect(page.body.querySelectorAll('text.yValueText').length).toBe(1);
    const text = page.body.querySelector('text.y') as SVGTextElement;
    const valueText = page.body.querySelector('text.yValueText') as SVGTextElement;
    expect(text.textContent!.toString()).toBe(`${SOME_LABEL}`);
    expect(valueText.toString()).toBe(`${Y_ANNOTATION.value.toString()}`);
  });

  it('updates annotations text and color correctly', async () => {
    const SOME_NEW_LABEL = 'some-label!';
    const NEW_COLOR = 'green';
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            label: {
              text: 'some random label',
              show: true,
            },
            showValue: false,
          },
        ],
      },
    });

    render(
      {
        annotations: {
          y: [
            {
              ...Y_ANNOTATION,
              color: NEW_COLOR,
              label: {
                text: SOME_NEW_LABEL,
                show: true,
              },
              showValue: false,
            },
          ],
        },
      },
      page
    );

    const text = page.body.querySelector('text.y') as SVGTextElement;
    expect(text.textContent).toBe(SOME_NEW_LABEL);
    expect(text.style.fill).toBe(NEW_COLOR);
  });

  it('deletes annotation when removed', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    render({ annotations: {} }, page);

    await page.waitForChanges();

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });
});
