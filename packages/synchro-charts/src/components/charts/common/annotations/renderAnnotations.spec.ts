import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { renderAnnotations, RenderAnnotationsOptions } from './renderAnnotations';
import { YAnnotation } from '../types';
import { SECOND_IN_MS } from '../../../../utils/time';
import {
  LINE_SELECTOR as X_LINE_SELECTOR,
  TEXT_SELECTOR as X_TEXT_SELECTOR,
  THRESHOLD_GROUP_SELECTOR as X_ANNOTATION_GROUP_SELECTOR,
} from './XAnnotations/XAnnotations';
import {
  LINE_SELECTOR as Y_LINE_SELECTOR,
  TEXT_SELECTOR as Y_TEXT_SELECTOR,
  TEXT_VALUE_SELECTOR as Y_TEXT_VALUE_SELECTOR,
  THRESHOLD_GROUP_SELECTOR as Y_THRESHOLD_SELECTOR,
} from './YAnnotations/YAnnotations';

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
    expect(page.body.querySelectorAll('g')).toBeEmpty();
  });

  it('renders no annotations when no annotations provided implicitly', async () => {
    const { page } = await newAnnotationsPage({ annotations: {} });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
    expect(page.body.querySelectorAll('g')).toBeEmpty();
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
    let yThresholdGroup = page.body.querySelector(Y_THRESHOLD_SELECTOR);
    let xAnnotationGroup = page.body.querySelector(X_ANNOTATION_GROUP_SELECTOR);

    expect(xLine).not.toBeNull();
    expect(xText).not.toBeNull();
    expect(yLine).not.toBeNull();
    expect(yText).not.toBeNull();
    expect(yTextValue).not.toBeNull();
    expect(yThresholdGroup).not.toBeNull();
    expect(xAnnotationGroup).not.toBeNull();

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
    yThresholdGroup = page.body.querySelector(Y_THRESHOLD_SELECTOR);
    xAnnotationGroup = page.body.querySelector(X_ANNOTATION_GROUP_SELECTOR);

    expect(xLine).toBeNull();
    expect(xText).toBeNull();
    expect(yLine).toBeNull();
    expect(yText).toBeNull();
    expect(yTextValue).toBeNull();
    expect(yThresholdGroup).toBeNull();
    expect(xAnnotationGroup).toBeNull();

    expect(page.body.querySelector('svg')).toMatchSnapshot();
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
    expect(page.body.querySelectorAll('g')).toBeEmpty();
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
    expect(page.body.querySelectorAll('g')).toBeEmpty();
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

    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);
    const text = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(text.textContent).toBe(SOME_LABEL);
    expect(text.style.fill).toBe(X_ANNOTATION.color);
  });

  it('updates annotations text and color', async () => {
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

    const text = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
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

    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);
    const text = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
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

    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(1);
    const text = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(text.getAttribute('display')).toEqual('none');
  });

  it('renders single annotation which is within middle of the viewport vertically', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    const lineX = page.body.querySelector(X_LINE_SELECTOR) as SVGLineElement;
    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(1);

    // Has expected lines
    expect(page.body.querySelectorAll(X_LINE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_LINE_SELECTOR)).toBeEmpty();

    // Line bisects the viewport vertically
    expect(lineX.getAttribute('x1')).toEqual((SIZE.width / 2).toString());
    expect(lineX.getAttribute('x2')).toEqual((SIZE.width / 2).toString());
    expect(lineX.getAttribute('y1')).toEqual('0');
    expect(lineX.getAttribute('y2')).toEqual(SIZE.height.toString());
  });

  it('has proper threshold grouping structure', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    render(
      {
        annotations: {
          x: [
            X_ANNOTATION,
            {
              ...X_ANNOTATION,
              value: new Date(VIEWPORT.end.getTime() - 1000),
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();
    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(2);

    const groupY = page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)[1] as SVGElement;
    expect(groupY.childElementCount).toEqual(2);
    expect(groupY.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(X_LINE_SELECTOR)).toHaveLength(1);

    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('renders initial color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [X_ANNOTATION],
      },
    });

    const lineX = page.body.querySelector(X_LINE_SELECTOR) as SVGLineElement;
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

    const lineX = page.body.querySelector(X_LINE_SELECTOR) as SVGLineElement;
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
              showValue: true,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    const lineX = page.body.querySelector(X_LINE_SELECTOR) as SVGLineElement;

    const updatedX = 0;
    expect(lineX.getAttribute('x1')).toEqual(updatedX.toString());
    expect(lineX.getAttribute('x2')).toEqual(updatedX.toString());

    const valueText = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(valueText.getAttribute('display')).toEqual('inline');
    expect(valueText.toString()).toBe('some text (12/31/1999)');
  });

  it('updates annotation text value visibility', async () => {
    const SOME_LABEL = 'some-label!';
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
              showValue: false,
            },
            {
              ...X_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: false,
              },
              value: VIEWPORT.start,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();
    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(2);

    const stableTextOne = page.body.querySelectorAll(X_TEXT_SELECTOR)[0] as SVGTextElement;
    expect(stableTextOne.getAttribute('display')).toEqual('inline');
    expect(stableTextOne.textContent!.toString()).toBe('some text');

    const textOne = page.body.querySelectorAll(X_TEXT_SELECTOR)[1] as SVGTextElement;
    expect(textOne.getAttribute('display')).toEqual('none');

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: true,
              },
              value: VIEWPORT.start,
              showValue: true,
            },
            {
              ...X_ANNOTATION,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    const textTwo = page.body.querySelectorAll(X_TEXT_SELECTOR)[0] as SVGTextElement;
    expect(textTwo.getAttribute('display')).toEqual('inline');
    expect(textTwo.toString()).toBe('some-label! (12/31/1999)');

    const stableTextTwo = page.body.querySelectorAll(X_TEXT_SELECTOR)[1] as SVGTextElement;
    expect(stableTextTwo.getAttribute('display')).toEqual('inline');
    expect(stableTextTwo.textContent!.toString()).toBe('some text');

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: false,
              },
              value: VIEWPORT.start,
              showValue: true,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);

    const textThree = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(textThree.getAttribute('display')).toEqual('inline');
    expect(textThree.toString()).toBe('(12/31/1999)');

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: true,
              },
              value: VIEWPORT.start,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    const textFour = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(textFour.getAttribute('display')).toEqual('inline');
    expect(textFour.toString()).toBe('some-label!');

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: false,
              },
              value: VIEWPORT.start,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);

    const textFive = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(textFive.getAttribute('display')).toEqual('none');
  });

  it('handles rendering updating multiple annotations', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          X_ANNOTATION,
          {
            ...X_ANNOTATION,
            value: new Date(VIEWPORT.end.getTime() - 100),
            showValue: false,
          },
        ],
      },
    });
    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(2);

    render(
      {
        annotations: {
          x: [
            X_ANNOTATION,
            {
              ...X_ANNOTATION,
              value: new Date(VIEWPORT.start.getTime() + 200),
              showValue: true,
            },
            {
              ...X_ANNOTATION,
              value: new Date(VIEWPORT.start.getTime() + 100),
              showValue: false,
              label: undefined,
            },
            {
              ...X_ANNOTATION,
              value: new Date(VIEWPORT.end.getTime() - 100),
              showValue: true,
            },
            {
              ...X_ANNOTATION,
              value: new Date(VIEWPORT.end.getTime() - 200),
              showValue: false,
            },
          ],
        },
      },
      page
    );
    await page.waitForChanges();
    expect(page.body.querySelectorAll(X_ANNOTATION_GROUP_SELECTOR)).toHaveLength(5);
    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(5);
    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('updates annotation label if added/removed', async () => {
    const SOME_LABEL = 'some-label!';
    const { page } = await newAnnotationsPage({
      annotations: {
        x: [
          {
            ...X_ANNOTATION,
            label: undefined,
            showValue: true,
            value: VIEWPORT.start,
          },
        ],
      },
    });

    const textOne = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(textOne.getAttribute('display')).toEqual('inline');
    expect(textOne.toString()).toBe('(12/31/1999)');

    render(
      {
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
      },
      page
    );

    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(X_LINE_SELECTOR)).toHaveLength(1);

    const textTwo = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(textTwo.getAttribute('display')).toEqual('inline');
    expect(textTwo.textContent!.toString()).toBe(SOME_LABEL);

    render(
      {
        annotations: {
          x: [
            {
              ...X_ANNOTATION,
              label: undefined,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    expect(page.body.querySelectorAll(X_TEXT_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(X_LINE_SELECTOR)).toHaveLength(1);

    const textThree = page.body.querySelector(X_TEXT_SELECTOR) as SVGTextElement;
    expect(textThree.getAttribute('display')).toEqual('none');
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
    expect(page.body.querySelectorAll('g')).toBeEmpty();
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
    expect(page.body.querySelectorAll('g')).toBeEmpty();
    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
  });

  it('renders single annotation bisecting the viewport', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    // Has group structure
    expect(page.body.querySelectorAll(Y_THRESHOLD_SELECTOR)).toHaveLength(1);

    const lineY = page.body.querySelector(Y_LINE_SELECTOR) as SVGLineElement;

    // Has expected lines
    expect(page.body.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(X_LINE_SELECTOR)).toBeEmpty();

    // Line bisects the viewport vertically
    expect(lineY.getAttribute('x1')).toEqual('0');
    expect(lineY.getAttribute('x2')).toEqual(SIZE.width.toString());
    expect(lineY.getAttribute('y1')).toEqual((SIZE.height / 2).toString());
    expect(lineY.getAttribute('y2')).toEqual((SIZE.height / 2).toString());
  });

  it('has proper threshold grouping structure', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    render(
      {
        annotations: {
          y: [
            Y_ANNOTATION,
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMax - 4,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();
    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(2);

    const groupY = page.body.querySelectorAll(Y_THRESHOLD_SELECTOR)[1] as SVGElement;
    expect(groupY.childElementCount).toEqual(3);
    expect(groupY.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);

    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('renders initial color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_ANNOTATION],
      },
    });

    const lineY = page.body.querySelector(Y_LINE_SELECTOR) as SVGLineElement;
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

    const lineY = page.body.querySelector(Y_LINE_SELECTOR) as SVGLineElement;
    expect(lineY.style.stroke).toBe(UPDATED_COLOR);
  });

  it('updates position and text value when value is updated', async () => {
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
              showValue: true,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    const lineY = page.body.querySelector(Y_LINE_SELECTOR) as SVGLineElement;

    const updatedY = 0;
    expect(lineY.getAttribute('y1')).toEqual(updatedY.toString());
    expect(lineY.getAttribute('y2')).toEqual(updatedY.toString());

    const valueText = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueText.getAttribute('display')).toEqual('inline');
    expect(valueText.toString()).toBe(VIEWPORT.yMax.toString());
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

    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    const text = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(text.textContent).toBe(SOME_LABEL);
    expect(text.style.fill).toBe(Y_ANNOTATION.color);
  });

  it('updates annotation label and value text visibility', async () => {
    const SOME_LABEL = 'some-label!';
    const newValue = (VIEWPORT.yMax + VIEWPORT.yMin) / 3;
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          Y_ANNOTATION,
          {
            ...Y_ANNOTATION,
            label: {
              text: SOME_LABEL,
              show: true,
            },
            showValue: false,
            value: newValue,
          },
        ],
      },
    });

    const stableLabelTextOne = page.body.querySelectorAll(Y_TEXT_SELECTOR)[0] as SVGTextElement;
    expect(stableLabelTextOne.getAttribute('display')).toEqual('inline');
    expect(stableLabelTextOne.textContent!.toString()).toBe('some text');

    const stableValueTextOne = page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)[0] as SVGTextElement;
    expect(stableValueTextOne.getAttribute('display')).toEqual('none');

    const labelTextOne = page.body.querySelectorAll(Y_TEXT_SELECTOR)[1] as SVGTextElement;
    expect(labelTextOne.getAttribute('display')).toEqual('inline');
    expect(labelTextOne.textContent!.toString()).toBe(SOME_LABEL);

    const valueTextOne = page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)[1] as SVGTextElement;
    expect(valueTextOne.getAttribute('display')).toEqual('none');

    render(
      {
        annotations: {
          y: [
            {
              ...Y_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: true,
              },
              value: newValue,
              showValue: true,
            },
            Y_ANNOTATION,
          ],
        },
      },
      page
    );

    expect(page.body.querySelector('svg')).toMatchSnapshot();

    const labelTextTwo = page.body.querySelectorAll(Y_TEXT_SELECTOR)[0] as SVGTextElement;
    expect(labelTextTwo.getAttribute('display')).toEqual('inline');
    expect(labelTextTwo.textContent!.toString()).toBe(SOME_LABEL);

    const valueTextTwo = page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)[0] as SVGTextElement;
    expect(valueTextTwo.getAttribute('display')).toEqual('inline');
    expect(valueTextTwo.toString()).toBe(newValue.toString());

    const stableLabelTextTwo = page.body.querySelectorAll(Y_TEXT_SELECTOR)[1] as SVGTextElement;
    expect(stableLabelTextTwo.getAttribute('display')).toEqual('inline');
    expect(stableLabelTextTwo.textContent!.toString()).toBe('some text');

    const stableValueTextTwo = page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)[1] as SVGTextElement;
    expect(stableValueTextTwo.getAttribute('display')).toEqual('none');

    render(
      {
        annotations: {
          y: [
            {
              ...Y_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: false,
              },
              value: newValue,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    const labelTextThree = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(labelTextThree.getAttribute('display')).toEqual('none');

    const valueTextThree = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueTextThree.getAttribute('display')).toEqual('none');

    render(
      {
        annotations: {
          y: [
            {
              ...Y_ANNOTATION,
              label: {
                text: SOME_LABEL,
                show: false,
              },
              value: newValue,
              showValue: true,
            },
          ],
        },
      },
      page
    );

    const labelTextFour = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(labelTextFour.getAttribute('display')).toEqual('none');

    const valueTextFour = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueTextFour.getAttribute('display')).toEqual('inline');
    expect(valueTextFour.toString()).toBe(newValue.toString());
  });

  // TODO CLEAN UP!
  it('updates annotation label if added/removed', async () => {
    const SOME_LABEL = 'some-label!';
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            label: undefined,
            showValue: true,
          },
        ],
      },
    });

    const textOne = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(textOne.getAttribute('display')).toEqual('none');

    const valueTextOne = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueTextOne.getAttribute('display')).toEqual('inline');

    render(
      {
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
      },
      page
    );

    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);

    const textTwo = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(textTwo.getAttribute('display')).toEqual('inline');
    expect(textTwo.textContent!.toString()).toBe(SOME_LABEL);

    const valueTextTwo = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueTextTwo.getAttribute('display')).toEqual('none');

    render(
      {
        annotations: {
          y: [
            {
              ...Y_ANNOTATION,
              label: undefined,
              showValue: false,
            },
          ],
        },
      },
      page
    );

    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);

    const textThree = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(textThree.getAttribute('display')).toEqual('none');

    const valueTextThree = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueTextThree.getAttribute('display')).toEqual('none');
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
    const text = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    const valueText = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(text.textContent!.toString()).toBe(SOME_LABEL);
    expect(valueText.toString()).toBe(`${Y_ANNOTATION.value.toString()}`);
    expect(text.getAttribute('display')).toEqual('inline');
    expect(valueText.getAttribute('display')).toEqual('inline');
  });

  it('updates annotations text and color', async () => {
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

    const text = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(text.getAttribute('display')).toEqual('inline');
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
    expect(page.body.querySelectorAll('g')).toBeEmpty();
  });

  it('handles rendering updating multiple annotations', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          Y_ANNOTATION,
          {
            ...Y_ANNOTATION,
            value: VIEWPORT.yMin + 3,
            showValue: false,
          },
        ],
      },
    });
    expect(page.body.querySelectorAll(Y_THRESHOLD_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(2);

    render(
      {
        annotations: {
          y: [
            Y_ANNOTATION,
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMin + 2,
              showValue: true,
            },
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMax - 1,
              showValue: false,
            },
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMax - 2,
              showValue: true,
            },
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMin + 1,
              showValue: false,
            },
          ],
        },
      },
      page
    );
    await page.waitForChanges();
    expect(page.body.querySelectorAll(Y_THRESHOLD_SELECTOR)).toHaveLength(5);
    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(5);
    expect(page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(5);
    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });
});
