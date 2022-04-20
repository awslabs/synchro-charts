import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { renderAnnotations, RenderAnnotationsOptions } from './renderAnnotations';
import { YAnnotation } from '../types';
import { SECOND_IN_MS } from '../../../../utils/time';
import {
  ANNOTATION_GROUP_SELECTOR as X_ANNOTATION_GROUP_SELECTOR,
  LINE_SELECTOR as X_LINE_SELECTOR,
  TEXT_SELECTOR as X_TEXT_SELECTOR,
} from './XAnnotations/XAnnotations';
import {
  ANNOTATION_DEFS_SELECTOR,
  ANNOTATION_GROUP_SELECTOR as Y_GROUP_SELECTOR,
  ANNOTATION_GROUP_SELECTOR_EDITABLE as Y_GROUP_EDITABLE_SELECTOR,
  DRAGGABLE_HANDLE_SELECTOR,
  DRAGGABLE_LINE_ONE_SELECTOR,
  DRAGGABLE_LINE_TWO_SELECTOR,
  ELEMENT_GROUP_SELECTOR as Y_ELEMENT_GROUP_SELECTOR,
  GRADIENT_RECT_SELECTOR,
  GRADIENT_STOP_SELECTOR,
  HANDLE_OFFSET_Y,
  HANDLE_WIDTH,
  LINE_SELECTOR as Y_LINE_SELECTOR,
  LINEAR_GRADIENT_SELECTOR,
  SMALL_HANDLE_WIDTH,
  TEXT_SELECTOR as Y_TEXT_SELECTOR,
  TEXT_VALUE_SELECTOR as Y_TEXT_VALUE_SELECTOR,
} from './YAnnotations/YAnnotations';
import { COMPARISON_OPERATOR } from '../constants';

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
    viewport: VIEWPORT,
    size: SIZE,
    onUpdate: () => {},
    activeViewPort: () => VIEWPORT,
    emitUpdatedWidgetConfiguration: () => {},
    draggable: () => {},
    startStopDragging: () => {},
    inDragState: () => false,
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
    expect(page.body.querySelectorAll('rect')).toBeEmpty();
    expect(page.body.querySelectorAll('g')).toBeEmpty();
    expect(page.body.querySelectorAll('defs')).toBeEmpty();
  });

  it('renders no annotations when no annotations provided implicitly', async () => {
    const { page } = await newAnnotationsPage({ annotations: {} });

    expect(page.body.querySelectorAll('line')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
    expect(page.body.querySelectorAll('rect')).toBeEmpty();
    expect(page.body.querySelectorAll('g')).toBeEmpty();
    expect(page.body.querySelectorAll('defs')).toBeEmpty();
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
      isEditable: true,
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
        y: [
          {
            id: 'annotation',
            ...Y_ANNOTATION,
          },
        ],
        show: true,
        displayThresholdGradient: true,
      },
    });

    let xLine = page.body.querySelector(X_LINE_SELECTOR);
    let xText = page.body.querySelector(X_TEXT_SELECTOR);
    let yLine = page.body.querySelector(Y_LINE_SELECTOR);
    let yText = page.body.querySelector(Y_TEXT_SELECTOR);
    let yTextValue = page.body.querySelector(Y_TEXT_VALUE_SELECTOR);
    let yHandle = page.body.querySelector(DRAGGABLE_HANDLE_SELECTOR);
    let yHandleDraggableLineOne = page.body.querySelector(DRAGGABLE_LINE_ONE_SELECTOR);
    let yHandleDraggableLineTwo = page.body.querySelector(DRAGGABLE_LINE_TWO_SELECTOR);
    let yAnnotationGroup = page.body.querySelector(`${Y_GROUP_SELECTOR}, ${Y_GROUP_EDITABLE_SELECTOR}`);
    let yElementGroup = page.body.querySelector(Y_ELEMENT_GROUP_SELECTOR);
    let xAnnotationGroup = page.body.querySelector(X_ANNOTATION_GROUP_SELECTOR);
    let annotationDefs = page.body.querySelector(ANNOTATION_DEFS_SELECTOR);
    let gradientRect = page.body.querySelector(GRADIENT_RECT_SELECTOR);
    let linearGradient = page.body.querySelector(LINEAR_GRADIENT_SELECTOR);

    expect(xLine).not.toBeNull();
    expect(xText).not.toBeNull();
    expect(yLine).not.toBeNull();
    expect(yText).not.toBeNull();
    expect(yTextValue).not.toBeNull();
    expect(yHandle).not.toBeNull();
    expect(yHandleDraggableLineOne).not.toBeNull();
    expect(yHandleDraggableLineTwo).not.toBeNull();
    expect(yAnnotationGroup).not.toBeNull();
    expect(xAnnotationGroup).not.toBeNull();
    expect(yElementGroup).not.toBeNull();
    expect(annotationDefs).not.toBeNull();
    expect(gradientRect).not.toBeNull();
    expect(linearGradient).not.toBeNull();

    render(
      {
        annotations: {
          x: [X_ANNOTATION],
          y: [Y_ANNOTATION],
          show: false,
          displayThresholdGradient: true,
        },
      },
      page
    );

    xLine = page.body.querySelector(X_LINE_SELECTOR);
    xText = page.body.querySelector(X_TEXT_SELECTOR);
    yLine = page.body.querySelector(Y_LINE_SELECTOR);
    yText = page.body.querySelector(Y_TEXT_SELECTOR);
    yTextValue = page.body.querySelector(Y_TEXT_VALUE_SELECTOR);
    yAnnotationGroup = page.body.querySelector(`${Y_GROUP_SELECTOR}, ${Y_GROUP_EDITABLE_SELECTOR}`);
    yHandle = page.body.querySelector(DRAGGABLE_HANDLE_SELECTOR);
    yHandleDraggableLineOne = page.body.querySelector(DRAGGABLE_LINE_ONE_SELECTOR);
    yHandleDraggableLineTwo = page.body.querySelector(DRAGGABLE_LINE_TWO_SELECTOR);
    xAnnotationGroup = page.body.querySelector(X_ANNOTATION_GROUP_SELECTOR);
    yElementGroup = page.body.querySelector(Y_ELEMENT_GROUP_SELECTOR);
    annotationDefs = page.body.querySelector(ANNOTATION_DEFS_SELECTOR);
    gradientRect = page.body.querySelector(GRADIENT_RECT_SELECTOR);
    linearGradient = page.body.querySelector(LINEAR_GRADIENT_SELECTOR);

    expect(xLine).toBeNull();
    expect(xText).toBeNull();
    expect(yLine).toBeNull();
    expect(yText).toBeNull();
    expect(yTextValue).toBeNull();
    expect(yHandle).toBeNull();
    expect(yHandleDraggableLineOne).toBeNull();
    expect(yHandleDraggableLineTwo).toBeNull();
    expect(yAnnotationGroup).toBeNull();
    expect(xAnnotationGroup).toBeNull();
    expect(yElementGroup).toBeNull();
    expect(annotationDefs).toBeNull();
    expect(gradientRect).toBeNull();
    expect(linearGradient).toBeNull();
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

  it('has proper annotation grouping structure', async () => {
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
    expect(page.body.querySelectorAll('rect')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
    expect(page.body.querySelectorAll(Y_ELEMENT_GROUP_SELECTOR)).toBeEmpty();
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
    expect(page.body.querySelectorAll('rect')).toBeEmpty();
    expect(page.body.querySelectorAll('text')).toBeEmpty();
    expect(page.body.querySelectorAll(Y_ELEMENT_GROUP_SELECTOR)).toBeEmpty();
  });

  it('renders single editable annotation bisecting the viewport', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            isEditable: true,
          },
        ],
      },
    });

    // Has group structure
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_ELEMENT_GROUP_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_GROUP_SELECTOR)).toBeEmpty();

    const yElementGroup = page.body.querySelector(Y_ELEMENT_GROUP_SELECTOR) as SVGElement;
    const yLine = page.body.querySelector(Y_LINE_SELECTOR) as SVGElement;

    // Has expected elements
    expect(page.body.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_TWO_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_ONE_SELECTOR)).toHaveLength(1);

    expect(page.body.querySelectorAll(X_LINE_SELECTOR)).toBeEmpty();

    // Line bisects the viewport vertically
    expect(yLine.getAttribute('x1')).toEqual('0');
    expect(yLine.getAttribute('x2')).toEqual(SIZE.width.toString());
    expect(yLine.getAttribute('y1')).toEqual('0');
    expect(yLine.getAttribute('y2')).toEqual('0');
    expect(yElementGroup.getAttribute('transform')).toEqual('translate(0,25)');
  });

  it('renders single non-editable annotation bisecting the viewport', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
          },
        ],
      },
    });

    // Has group structure
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toBeEmpty();
    expect(page.body.querySelectorAll(Y_ELEMENT_GROUP_SELECTOR)).toBeEmpty();
    expect(page.body.querySelectorAll(Y_GROUP_SELECTOR)).toHaveLength(1);

    const yGroup = page.body.querySelector(Y_GROUP_SELECTOR) as SVGElement;
    const yLine = page.body.querySelector(Y_LINE_SELECTOR) as SVGElement;

    // Has expected elements
    expect(page.body.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toBeEmpty();
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_TWO_SELECTOR)).toBeEmpty();
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_ONE_SELECTOR)).toBeEmpty();

    expect(page.body.querySelectorAll(X_LINE_SELECTOR)).toBeEmpty();

    // Line bisects the viewport vertically
    expect(yLine.getAttribute('x1')).toEqual('0');
    expect(yLine.getAttribute('x2')).toEqual(SIZE.width.toString());
    expect(yLine.getAttribute('y1')).toEqual('0');
    expect(yLine.getAttribute('y2')).toEqual('0');
    expect(yGroup.getAttribute('transform')).toEqual('translate(0,25)');
  });

  it('annotation has proper grouping structure', async () => {
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
              isEditable: true,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();
    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_ELEMENT_GROUP_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_GROUP_SELECTOR)).toHaveLength(1);

    const editableGroupY = page.body.querySelector(Y_GROUP_EDITABLE_SELECTOR) as SVGElement;
    expect(editableGroupY.childElementCount).toEqual(2);
    expect(editableGroupY.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toHaveLength(1);

    const elementGroupY = page.body.querySelector(Y_ELEMENT_GROUP_SELECTOR) as SVGElement;
    expect(elementGroupY.childElementCount).toEqual(6);
    expect(elementGroupY.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(DRAGGABLE_LINE_ONE_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(DRAGGABLE_LINE_TWO_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(GRADIENT_RECT_SELECTOR)).toHaveLength(1);

    const groupY = page.body.querySelector(Y_GROUP_SELECTOR) as SVGElement;
    expect(groupY.childElementCount).toEqual(4);
    expect(groupY.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toBeEmpty();
    expect(groupY.querySelectorAll(GRADIENT_RECT_SELECTOR)).toHaveLength(1);
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
        y: [{ ...Y_ANNOTATION, isEditable: true, showValue: true }],
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
              isEditable: true,
              showValue: true,
            },
          ],
        },
      },
      page
    );
    await page.waitForChanges();

    const lineY = page.body.querySelector(Y_LINE_SELECTOR) as SVGLineElement;
    expect(lineY.style.stroke).toBe(UPDATED_COLOR);

    const handle = page.body.querySelector(DRAGGABLE_HANDLE_SELECTOR) as SVGRectElement;
    expect(handle.style.stroke).toBe(UPDATED_COLOR);

    const valueText = page.body.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueText.style.fill).toBe(UPDATED_COLOR);

    const labelText = page.body.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(labelText.style.fill).toBe(UPDATED_COLOR);

    const handleLineOne = page.body.querySelector(DRAGGABLE_LINE_ONE_SELECTOR) as SVGLineElement;
    expect(handleLineOne.style.stroke).toBe('gray');

    const handleLineTwo = page.body.querySelector(DRAGGABLE_LINE_TWO_SELECTOR) as SVGLineElement;
    expect(handleLineTwo.style.stroke).toBe('gray');
  });

  it('updates position and text value when value is updated', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          Y_ANNOTATION,
          {
            ...Y_ANNOTATION,
            value: VIEWPORT.yMax - 2,
            showValue: true,
            isEditable: true,
          },
        ],
      },
    });

    render(
      {
        annotations: {
          y: [
            Y_ANNOTATION,
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMin + 7,
              showValue: true,
              isEditable: true,
            },
          ],
        },
      },
      page
    );

    await page.waitForChanges();

    expect(page.body.querySelector('svg')).toMatchSnapshot();

    const lineY = page.body.querySelectorAll(Y_LINE_SELECTOR)[1] as SVGLineElement;

    expect(lineY.getAttribute('y1')).toEqual('0');
    expect(lineY.getAttribute('y2')).toEqual('0');

    const updatedY = 46.5;

    const handle = page.body.querySelector(DRAGGABLE_HANDLE_SELECTOR) as SVGRectElement;
    expect(handle.getAttribute('y')).toEqual((updatedY + HANDLE_OFFSET_Y).toString());

    const valueText = page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)[1] as SVGTextElement;
    expect(valueText.getAttribute('display')).toEqual('inline');
    expect(valueText.toString()).toBe('7');

    const yGroupEditable = page.body.querySelector(Y_GROUP_EDITABLE_SELECTOR) as SVGElement;
    expect(yGroupEditable.getAttribute('transform')).toEqual('translate(0,0)');

    const yElementGroup = page.body.querySelector(Y_ELEMENT_GROUP_SELECTOR) as SVGElement;
    expect(yElementGroup.getAttribute('transform')).toEqual(`translate(0,${updatedY})`);
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
    const newValue = 33.3333333333333333;
    const expectedDisplayValue = '33.33';
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
            isEditable: true,
          },
        ],
      },
    });

    const nonEditableOne = page.body.querySelector(Y_GROUP_SELECTOR) as SVGElement;

    const stableLabelTextOne = nonEditableOne.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(stableLabelTextOne.getAttribute('display')).toEqual('inline');
    expect(stableLabelTextOne.textContent!.toString()).toBe('some text');

    const stableValueTextOne = nonEditableOne.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(stableValueTextOne.getAttribute('display')).toEqual('none');

    const editableOne = page.body.querySelector(Y_GROUP_EDITABLE_SELECTOR) as SVGElement;

    const labelTextOne = editableOne.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(labelTextOne.getAttribute('display')).toEqual('inline');
    expect(labelTextOne.textContent!.toString()).toBe(SOME_LABEL);

    const valueTextOne = editableOne.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
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
              isEditable: true,
            },
            Y_ANNOTATION,
          ],
        },
      },
      page
    );

    expect(page.body.querySelector('svg')).toMatchSnapshot();

    const nonEditableTwo = page.body.querySelector(Y_GROUP_SELECTOR) as SVGElement;

    const stableLabelTextTwo = nonEditableTwo.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(stableLabelTextTwo.getAttribute('display')).toEqual('inline');
    expect(stableLabelTextTwo.textContent!.toString()).toBe('some text');

    const stableValueTextTwo = nonEditableTwo.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(stableValueTextTwo.getAttribute('display')).toEqual('none');

    const editableTwo = page.body.querySelector(Y_GROUP_EDITABLE_SELECTOR) as SVGElement;

    const labelTextTwo = editableTwo.querySelector(Y_TEXT_SELECTOR) as SVGTextElement;
    expect(labelTextTwo.getAttribute('display')).toEqual('inline');
    expect(labelTextTwo.textContent!.toString()).toBe(SOME_LABEL);

    const valueTextTwo = editableTwo.querySelector(Y_TEXT_VALUE_SELECTOR) as SVGTextElement;
    expect(valueTextTwo.getAttribute('display')).toEqual('inline');

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
    expect(valueTextFour.toString()).toBe(expectedDisplayValue);
  });

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
    expect(page.body.querySelectorAll('defs')).toBeEmpty();
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
            isEditable: true,
          },
        ],
      },
    });
    expect(page.body.querySelectorAll(Y_GROUP_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_TWO_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_ONE_SELECTOR)).toHaveLength(1);

    render(
      {
        annotations: {
          y: [
            Y_ANNOTATION,
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMin + 2,
              showValue: true,
              isEditable: true,
            },
            {
              ...Y_ANNOTATION,
              value: VIEWPORT.yMax - 1,
              showValue: false,
              isEditable: true,
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
    expect(page.body.querySelectorAll(Y_GROUP_SELECTOR)).toHaveLength(3);
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(5);
    expect(page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(5);
    expect(page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_TWO_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_ONE_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('renders different draggable handles for annotations according to showValue', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_ANNOTATION,
            showValue: true,
            isEditable: true,
            color: 'red',
          },
          {
            ...Y_ANNOTATION,
            value: VIEWPORT.yMin + 3,
            showValue: false,
            isEditable: true,
            color: 'blue',
          },
        ],
      },
    });
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_TWO_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(DRAGGABLE_LINE_ONE_SELECTOR)).toHaveLength(2);

    const draggableHandleOne = page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)[0] as SVGRectElement;
    expect(draggableHandleOne.getAttribute('width')).toEqual(HANDLE_WIDTH.toString());

    const draggableHandleTwo = page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)[1] as SVGRectElement;
    expect(draggableHandleTwo.getAttribute('width')).toEqual(SMALL_HANDLE_WIDTH.toString());

    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('updates type of annotation rendered depending on isEditable', async () => {
    const SOME_LABEL = 'some-label!';
    const newValue = 33.3333333333333333;
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
            value: newValue,
          },
        ],
      },
    });

    render(
      {
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
              isEditable: true,
            },
          ],
        },
      },
      page
    );

    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_ELEMENT_GROUP_SELECTOR)).toHaveLength(1);
    expect(page.body.querySelectorAll(Y_GROUP_SELECTOR)).toHaveLength(1);

    const editableGroupY = page.body.querySelector(Y_GROUP_EDITABLE_SELECTOR) as SVGElement;
    expect(editableGroupY.childElementCount).toEqual(2);
    expect(editableGroupY.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toHaveLength(1);

    const elementGroupY = page.body.querySelector(Y_ELEMENT_GROUP_SELECTOR) as SVGElement;
    expect(elementGroupY.childElementCount).toEqual(6);
    expect(elementGroupY.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(DRAGGABLE_LINE_ONE_SELECTOR)).toHaveLength(1);
    expect(elementGroupY.querySelectorAll(DRAGGABLE_LINE_TWO_SELECTOR)).toHaveLength(1);

    const groupY = page.body.querySelector(Y_GROUP_SELECTOR) as SVGElement;
    expect(groupY.childElementCount).toEqual(4);
    expect(groupY.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);
    expect(groupY.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toBeEmpty();

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
              isEditable: true,
            },
            Y_ANNOTATION,
          ],
        },
      },
      page
    );

    expect(page.body.querySelector('svg')).toMatchSnapshot();

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

    expect(page.body.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_GROUP_SELECTOR)).toHaveLength(2);
    expect(page.body.querySelectorAll(Y_GROUP_EDITABLE_SELECTOR)).toBeEmpty();
    expect(page.body.querySelectorAll(Y_ELEMENT_GROUP_SELECTOR)).toBeEmpty();
    expect(page.body.querySelectorAll(DRAGGABLE_HANDLE_SELECTOR)).toBeEmpty();

    const groupYTwo = page.body.querySelectorAll(Y_GROUP_SELECTOR)[1] as SVGElement;
    expect(groupYTwo.childElementCount).toEqual(4);
    expect(groupYTwo.querySelectorAll(Y_TEXT_SELECTOR)).toHaveLength(1);
    expect(groupYTwo.querySelectorAll(Y_LINE_SELECTOR)).toHaveLength(1);
    expect(groupYTwo.querySelectorAll(Y_TEXT_VALUE_SELECTOR)).toHaveLength(1);
  });
});

describe('y thresholds with gradients', () => {
  // for gradient to be enabled, we must enable displayThresholdGradient and each threshold must have an id
  const Y_THRESHOLD: YAnnotation = {
    color: 'blue',
    showValue: true,
    label: {
      text: 'some text',
      show: true,
    },
    value: (VIEWPORT.yMax - VIEWPORT.yMin) / 2 + VIEWPORT.yMin,
    comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    id: 'threshold-one',
  };

  it('renders correctly', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_THRESHOLD],
        displayThresholdGradient: true,
      },
    });
    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('has proper grouping structure', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_THRESHOLD],
        displayThresholdGradient: true,
      },
    });

    render(
      {
        annotations: {
          y: [
            Y_THRESHOLD,
            {
              ...Y_THRESHOLD,
              id: 'threshold-two',
              value: VIEWPORT.yMax - 4,
              showValue: false,
              isEditable: true,
              comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
            },
          ],
          displayThresholdGradient: true,
        },
      },
      page
    );

    await page.waitForChanges();
    expect(page.body.querySelectorAll(ANNOTATION_DEFS_SELECTOR)).toHaveLength(1);

    const gradientDefs = page.body.querySelector(ANNOTATION_DEFS_SELECTOR) as SVGElement;
    expect(gradientDefs.childElementCount).toEqual(2);
    expect(gradientDefs.querySelectorAll(LINEAR_GRADIENT_SELECTOR)).toHaveLength(2);

    const editableGroupY = page.body.querySelector(Y_GROUP_EDITABLE_SELECTOR) as SVGElement;
    expect(editableGroupY.childElementCount).toEqual(2);

    const elementGroupY = page.body.querySelector(Y_ELEMENT_GROUP_SELECTOR) as SVGElement;
    expect(elementGroupY.childElementCount).toEqual(6);

    expect(elementGroupY.querySelectorAll(GRADIENT_RECT_SELECTOR)).toHaveLength(1);

    const groupY = page.body.querySelector(Y_GROUP_SELECTOR) as SVGElement;
    expect(groupY.childElementCount).toEqual(4);

    expect(groupY.querySelectorAll(GRADIENT_RECT_SELECTOR)).toHaveLength(1);

    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('renders initial color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_THRESHOLD],
        displayThresholdGradient: true,
      },
    });
    await page.waitForChanges();

    const linearGradient = page.body.querySelector(LINEAR_GRADIENT_SELECTOR) as SVGElement;
    const stopOne = linearGradient.querySelector(`${GRADIENT_STOP_SELECTOR}-one`) as SVGStopElement;
    expect(stopOne.getAttribute('offset')).toBe('0%');
    expect(stopOne.style.stopColor).toBe('blue');
    expect(stopOne.style.stopOpacity).toBe('0');

    const stopTwo = linearGradient.querySelector(`${GRADIENT_STOP_SELECTOR}-two`) as SVGStopElement;
    expect(stopTwo.getAttribute('offset')).toBe('80%');
    expect(stopTwo.style.stopColor).toBe('blue');
    expect(stopTwo.style.stopOpacity).toBe('0.33');

    expect(page.body.querySelector('svg')).toMatchSnapshot();

    const gradientRect = page.body.querySelector(GRADIENT_RECT_SELECTOR) as SVGRectElement;
    expect(gradientRect.getAttribute('display')).toBe('inline');
    expect(gradientRect.style.fill).toBe(`url(#${Y_THRESHOLD.id}--${Y_THRESHOLD.color})`);
  });

  it('renders updated color', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_THRESHOLD],
        displayThresholdGradient: true,
      },
    });

    render(
      {
        annotations: {
          y: [
            {
              ...Y_THRESHOLD,
              color: 'red',
            },
          ],
          displayThresholdGradient: true,
        },
      },
      page
    );
    await page.waitForChanges();

    const linearGradient = page.body.querySelector(LINEAR_GRADIENT_SELECTOR) as SVGElement;
    expect(linearGradient.id).toBe(`${Y_THRESHOLD.id}--red`);
    const stopOne = linearGradient.querySelector(`${GRADIENT_STOP_SELECTOR}-one`) as SVGStopElement;
    expect(stopOne.style.stopColor).toBe('red');

    const stopTwo = linearGradient.querySelector(`${GRADIENT_STOP_SELECTOR}-two`) as SVGStopElement;
    expect(stopTwo.style.stopColor).toBe('red');

    const gradientRect = page.body.querySelector(GRADIENT_RECT_SELECTOR) as SVGRectElement;
    expect(gradientRect.getAttribute('display')).toBe('inline');
    expect(gradientRect.style.fill).toBe(`url(#${Y_THRESHOLD.id}--red)`);
  });

  it('renders different gradients depending on comparisonOperator', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_THRESHOLD,
          },
          {
            ...Y_THRESHOLD,
            comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
          },
        ],
        displayThresholdGradient: true,
      },
    });
    await page.waitForChanges();

    const gradientRectOne = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[0] as SVGRectElement;
    expect(gradientRectOne.getAttribute('display')).toBe('inline');
    expect(gradientRectOne.getAttribute('transform')).toBe('rotate(0)');
    expect(gradientRectOne.style.fill).toBe(`url(#${Y_THRESHOLD.id}--blue)`);

    const gradientRectTwo = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[1] as SVGRectElement;
    expect(gradientRectTwo.getAttribute('transform')).toBe('rotate(180)');
  });

  it('renders gradients on comparisonOperator update', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_THRESHOLD,
          },
          {
            ...Y_THRESHOLD,
            comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
          },
        ],
        displayThresholdGradient: true,
      },
    });
    await page.waitForChanges();

    render(
      {
        annotations: {
          y: [
            {
              ...Y_THRESHOLD,
              comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
            },
            {
              ...Y_THRESHOLD,
              comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
            },
          ],
          displayThresholdGradient: true,
        },
      },
      page
    );
    await page.waitForChanges();

    const gradientRectOne = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[0] as SVGRectElement;
    expect(gradientRectOne.getAttribute('transform')).toBe('rotate(180)');

    const gradientRectTwo = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[1] as SVGRectElement;
    expect(gradientRectTwo.getAttribute('transform')).toBe('rotate(0)');
  });

  it('does not render gradients when displayThresholdGradient is disabled', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_THRESHOLD],
        displayThresholdGradient: true,
      },
    });
    await page.waitForChanges();

    render(
      {
        annotations: {
          y: [Y_THRESHOLD],
          displayThresholdGradient: false,
        },
      },
      page
    );
    await page.waitForChanges();

    const gradientRectOne = page.body.querySelector(GRADIENT_RECT_SELECTOR) as SVGRectElement;
    expect(gradientRectOne.getAttribute('display')).toBe('none');
  });

  it('does not render gradients when id is missing ', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_THRESHOLD,
          },
          {
            ...Y_THRESHOLD,
            comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
          },
        ],
        displayThresholdGradient: true,
      },
    });
    await page.waitForChanges();

    render(
      {
        annotations: {
          y: [
            {
              ...Y_THRESHOLD,
              id: undefined,
              comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
            },
            {
              ...Y_THRESHOLD,
              comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
            },
          ],
          displayThresholdGradient: true,
        },
      },
      page
    );
    await page.waitForChanges();

    const gradientRectOne = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[0] as SVGRectElement;
    expect(gradientRectOne.getAttribute('display')).toBe('none');

    const gradientRectTwo = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[1] as SVGRectElement;
    expect(gradientRectTwo.getAttribute('display')).toBe('none');
  });

  it('does not render gradients for non-thresholds (annotations) ', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [
          {
            ...Y_THRESHOLD,
          },
          {
            ...Y_THRESHOLD,
            comparisonOperator: undefined,
          },
        ],
        displayThresholdGradient: true,
      },
    });
    await page.waitForChanges();

    const gradientRectOne = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[0] as SVGRectElement;
    expect(gradientRectOne.getAttribute('display')).toBe('inline');

    const gradientRectTwo = page.body.querySelectorAll(GRADIENT_RECT_SELECTOR)[1] as SVGRectElement;
    expect(gradientRectTwo.getAttribute('display')).toBe('none');

    expect(page.body.querySelector('svg')).toMatchSnapshot();
  });

  it('deletes gradient when removed', async () => {
    const { page } = await newAnnotationsPage({
      annotations: {
        y: [Y_THRESHOLD],
      },
    });

    render({ annotations: {} }, page);

    await page.waitForChanges();

    expect(page.body.querySelectorAll(ANNOTATION_DEFS_SELECTOR)).toBeEmpty();
    expect(page.body.querySelectorAll('rect')).toBeEmpty();
  });
});
