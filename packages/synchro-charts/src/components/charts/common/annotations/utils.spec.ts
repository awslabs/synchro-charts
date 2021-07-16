import { Annotation, Annotations, Threshold, XAnnotation, YAnnotation } from '../types';
import {
  getBreachedThreshold,
  getLabelTextVisibility,
  getNumberAnnotations,
  getNumberThresholds,
  getText,
  getThresholds,
  getValueAndText,
  getValueAndTextVisibility,
  getValueText,
  getValueTextVisibility,
  isThreshold,
  isThresholdBreached,
  sortThreshold,
} from './utils';
import { VIEWPORT } from '../testUtil';
import { highestPriorityThreshold, thresholdAppliesToDataStream } from './breachedThreshold';
import { COMPARISON_OPERATOR } from '../constants';

describe('getValueAndText and getValueAndTextVisibility', () => {
  it('returns a text from annotation', () => {
    const annotationLabelText = 'new label';
    const xAnnotations: XAnnotation[] = [
      {
        color: 'red',
        value: new Date(2000, 1, 1),
        showValue: false,
        label: {
          text: annotationLabelText,
          show: true,
        },
      },
    ];
    const text = getText(xAnnotations[0]);
    expect(text).toBe(annotationLabelText);

    const displayMode = getLabelTextVisibility(xAnnotations[0]);
    expect(displayMode).toEqual('inline');
  });

  it('returns a value text from annotation', () => {
    const value = 50;
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: false,
    });
    expect(valueText).toBe(value.toString());

    const displayMode = getValueTextVisibility(yAnnotations[0]);
    expect(displayMode).toEqual('inline');
  });

  it('returns value and text for an annotation', () => {
    const value = 50;
    const label = 'label';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: label,
          show: true,
        },
      },
    ];
    const valueAndText = getValueAndText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
    });

    expect(valueAndText).toBe(`${label} (${value})`);

    const displayMode = getValueAndTextVisibility(yAnnotations[0]);
    expect(displayMode).toEqual('inline');
  });

  it('returns only text if showValue is false', () => {
    const value = 50;
    const label = 'label';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: false,
        label: {
          text: label,
          show: true,
        },
      },
    ];
    const valueAndText = getValueAndText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
    });

    expect(valueAndText).toBe(label);
    const displayMode = getValueAndTextVisibility(yAnnotations[0]);
    expect(displayMode).toEqual('inline');
  });

  it('returns empty label of value and label if not specified to be shown', () => {
    const value = 50;
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
      },
    ];
    const valueAndText = getValueAndText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
    });

    expect(valueAndText).toBeEmpty();

    const displayMode = getValueAndTextVisibility(yAnnotations[0]);
    expect(displayMode).toEqual('none');
  });

  it('returns empty label of value if not specified to be shown', () => {
    const value = 50;
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: false,
      },
    ];
    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: false,
    });

    expect(valueText).toBeEmpty();

    const displayMode = getValueTextVisibility(yAnnotations[0]);
    expect(displayMode).toEqual('none');
  });

  it('returns empty label if not specified to be shown', () => {
    const value = 50;
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        label: {
          text: 'test',
          show: false,
        },
      },
    ];
    const labelText = getText(yAnnotations[0]);

    expect(labelText).toBeEmpty();

    const displayMode = getLabelTextVisibility(yAnnotations[0]);
    expect(displayMode).toEqual('none');
  });
});

describe('getValueAndText niceDisplayValueText', () => {
  it('returns rounded exponential value for very small numbers - edge', () => {
    const value = 0.000000156;
    const expectedDisplayValue = '1.6e-7';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });

    expect(valueText).toBe(expectedDisplayValue);
  });

  it('returns rounded exponential value for very small numbers - edge', () => {
    const value = 0.0009987;
    const expectedDisplayValue = '1.0e-3';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });

    expect(valueText).toBe(expectedDisplayValue);
  });

  it('returns rounded exponential value for very large numbers - edge', () => {
    const value = 199999;
    const expectedDisplayValue = '2.0e+5';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });

    expect(valueText).toBe(expectedDisplayValue);
  });

  it('returns rounded exponential value for very large numbers', () => {
    const value = 9987654321;
    const expectedDisplayValue = '1.0e+10';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });

    expect(valueText).toBe(expectedDisplayValue);
  });

  it('returns truncated value for small numbers - edge', () => {
    const value = 0.0012345;
    const expectedDisplayValue = '0.001';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });
    expect(valueText).toBe(expectedDisplayValue);
  });

  it('returns truncated value for small numbers', () => {
    const value = 0.98765;
    const expectedDisplayValue = '0.987';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });

    expect(valueText).toBe(expectedDisplayValue);
  });

  it('returns truncated value for large decimal values in range', () => {
    const value = 12345.6789;
    const expectedDisplayValue = '12345';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });

    expect(valueText).toBe(expectedDisplayValue);
  });

  it('returns truncated value for small decimal values in range', () => {
    const value = 0.23456789;
    const expectedDisplayValue = '0.234';
    const yAnnotations: YAnnotation[] = [
      {
        color: 'red',
        value,
        showValue: true,
        label: {
          text: 'label',
          show: true,
        },
      },
    ];

    const valueText = getValueText({
      annotation: yAnnotations[0],
      resolution: 1000,
      viewport: VIEWPORT,
      niceDisplayValueText: true,
    });

    expect(valueText).toBe(expectedDisplayValue);
  });
});

describe('annotation logic', () => {
  describe.each`
    key      | thresholdValue | operator                                  | expected
    ${1}     | ${2}           | ${COMPARISON_OPERATOR.GREATER_THAN_EQUAL} | ${false}
    ${1}     | ${2}           | ${COMPARISON_OPERATOR.GREATER_THAN}       | ${false}
    ${1}     | ${2}           | ${COMPARISON_OPERATOR.LESS_THAN_EQUAL}    | ${true}
    ${1}     | ${2}           | ${COMPARISON_OPERATOR.LESS_THAN}          | ${true}
    ${1}     | ${1}           | ${COMPARISON_OPERATOR.GREATER_THAN_EQUAL} | ${true}
    ${1}     | ${1}           | ${COMPARISON_OPERATOR.GREATER_THAN}       | ${false}
    ${1}     | ${1}           | ${COMPARISON_OPERATOR.LESS_THAN_EQUAL}    | ${true}
    ${1}     | ${1}           | ${COMPARISON_OPERATOR.LESS_THAN}          | ${false}
    ${0}     | ${0}           | ${COMPARISON_OPERATOR.GREATER_THAN_EQUAL} | ${true}
    ${0}     | ${0}           | ${COMPARISON_OPERATOR.GREATER_THAN}       | ${false}
    ${0}     | ${0}           | ${COMPARISON_OPERATOR.LESS_THAN_EQUAL}    | ${true}
    ${0}     | ${0}           | ${COMPARISON_OPERATOR.LESS_THAN}          | ${false}
    ${-1}    | ${-1}          | ${COMPARISON_OPERATOR.GREATER_THAN_EQUAL} | ${true}
    ${-1}    | ${-1}          | ${COMPARISON_OPERATOR.GREATER_THAN}       | ${false}
    ${-1}    | ${-1}          | ${COMPARISON_OPERATOR.LESS_THAN_EQUAL}    | ${true}
    ${-1}    | ${-1}          | ${COMPARISON_OPERATOR.LESS_THAN}          | ${false}
    ${-1}    | ${0}           | ${COMPARISON_OPERATOR.GREATER_THAN_EQUAL} | ${false}
    ${-1}    | ${0}           | ${COMPARISON_OPERATOR.GREATER_THAN}       | ${false}
    ${-1}    | ${0}           | ${COMPARISON_OPERATOR.LESS_THAN_EQUAL}    | ${true}
    ${-1}    | ${0}           | ${COMPARISON_OPERATOR.LESS_THAN}          | ${true}
    ${1}     | ${0}           | ${COMPARISON_OPERATOR.GREATER_THAN_EQUAL} | ${true}
    ${1}     | ${0}           | ${COMPARISON_OPERATOR.GREATER_THAN}       | ${true}
    ${1}     | ${0}           | ${COMPARISON_OPERATOR.LESS_THAN_EQUAL}    | ${false}
    ${1}     | ${0}           | ${COMPARISON_OPERATOR.LESS_THAN}          | ${false}
    ${0}     | ${-1}          | ${COMPARISON_OPERATOR.GREATER_THAN_EQUAL} | ${true}
    ${0}     | ${-1}          | ${COMPARISON_OPERATOR.GREATER_THAN}       | ${true}
    ${0}     | ${-1}          | ${COMPARISON_OPERATOR.LESS_THAN_EQUAL}    | ${false}
    ${0}     | ${-1}          | ${COMPARISON_OPERATOR.LESS_THAN}          | ${false}
    ${1.5}   | ${1.5}         | ${COMPARISON_OPERATOR.EQUAL}              | ${true}
    ${1.6}   | ${1.5}         | ${COMPARISON_OPERATOR.EQUAL}              | ${false}
    ${0}     | ${0.1}         | ${COMPARISON_OPERATOR.EQUAL}              | ${false}
    ${'UP'}  | ${'UP'}        | ${COMPARISON_OPERATOR.EQUAL}              | ${true}
    ${'ON'}  | ${'OFF'}       | ${COMPARISON_OPERATOR.EQUAL}              | ${false}
    ${''}    | ${'UP'}        | ${COMPARISON_OPERATOR.EQUAL}              | ${false}
    ${'1'}   | ${1}           | ${COMPARISON_OPERATOR.EQUAL}              | ${true}
    ${2e2}   | ${2e2}         | ${COMPARISON_OPERATOR.EQUAL}              | ${true}
    ${'2e2'} | ${2e2}         | ${COMPARISON_OPERATOR.EQUAL}              | ${true}
    ${NaN}   | ${NaN}         | ${COMPARISON_OPERATOR.EQUAL}              | ${false}
  `('Check if data point is within the threshold', ({ key, thresholdValue, operator, expected }) => {
    test(`Given the data value of
    ${key} and threshold value of ${thresholdValue} and
    the operator ${operator}, we expect: ${expected}`, () => {
      const threshold: Threshold = {
        color: 'red',
        value: thresholdValue,
        comparisonOperator: operator,
      };
      expect(isThresholdBreached(key, threshold)).toEqual(expected);
    });
  });

  describe('threshold utils', () => {
    it('returns undefined when empty annotations are passed in', () => {
      const thresholds: Threshold[] = [];

      expect(getBreachedThreshold(3, thresholds)).toBeNil();
    });

    it('returns the correct annotation when the value is less than annotation', () => {
      const expectedValue = 2;
      const dataValue = 1;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toEqual(expect.objectContaining({ value: expectedValue }));
    });

    it('returns undefined when the value is equal to an annotation that only checks less then logic', () => {
      const expectedValue = 2;
      const dataValue = expectedValue;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toBeNil();
    });

    it('returns the correct annotation when the value is less than or equal to annotation', () => {
      const expectedValue = 2;
      const dataValue = 2;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toEqual(expect.objectContaining({ value: expectedValue }));
    });

    it('returns undefined when the value is greater than the annotation that checks for less than or equal', () => {
      const expectedValue = 2;
      const dataValue = 3;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toBeUndefined();
    });

    it('returns the correct annotation when the value is greater than annotation', () => {
      const expectedValue = 2;
      const dataValue = 3;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toEqual(expect.objectContaining({ value: expectedValue }));
    });

    it('returns undefined when the value is equal to an annotation that only checks greater then logic', () => {
      const expectedValue = 2;
      const dataValue = 2;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toBeNil();
    });

    it('returns the correct annotation when the value is greater than or equal to annotation', () => {
      const expectedValue = 2;
      const dataValue = 2;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toEqual(expect.objectContaining({ value: expectedValue }));
    });

    it('returns undefined when the value is less than then annotation that checks for greater than or equal', () => {
      const expectedValue = 2;
      const dataValue = 1;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(dataValue, thresholds)).toBeUndefined();
    });

    it('returns the annotation that is closest to the value', () => {
      const expectedValue = 2;
      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: -2,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
        {
          color: 'red',
          value: expectedValue,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
        {
          color: 'red',
          value: 6,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(3, thresholds)).toEqual(expect.objectContaining({ value: expectedValue }));
    });

    it('returns the annotation with the highest value that covers the point', () => {
      const expectValue = 6;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: -2,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
        {
          color: 'red',
          value: 2,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
        {
          color: 'red',
          value: expectValue,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(3, thresholds)).toEqual(expect.objectContaining({ value: expectValue }));
    });

    it('returns the upper annotation when a positive point data point breaches two annotations', () => {
      const expectValue = 7;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: -2,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
        {
          color: 'red',
          value: 2,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
        {
          color: 'red',
          value: 5,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
        {
          color: 'red',
          value: expectValue,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(6, thresholds)).toEqual(expect.objectContaining({ value: expectValue }));
    });

    it('returns the lower annotation when a negative point data point breaches two annotations', () => {
      const expectValue = -20;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: expectValue,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
        {
          color: 'red',
          value: -2,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
        {
          color: 'red',
          value: 5,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
        {
          color: 'red',
          value: 7,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(-15, thresholds)).toEqual(expect.objectContaining({ value: expectValue }));
    });

    it('returns the correct annotation when unsorted annotations passed in', () => {
      const expectValue = 3;

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: 5,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
        {
          color: 'red',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
        {
          color: 'red',
          value: expectValue,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
        {
          color: 'red',
          value: -2,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
      ];

      expect(getBreachedThreshold(2, thresholds)).toEqual(expect.objectContaining({ value: expectValue }));
    });

    it('returns true when the object is a threshold type', () => {
      expect(
        isThreshold({
          color: 'red',
          value: -2,
          showValue: false,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        })
      ).toBeTrue();
    });

    it('returns false when the object is not of a threshold type', () => {
      expect(
        isThreshold({
          color: 'red',
          value: -2,
          showValue: false,
        })
      ).toBeFalse();
    });

    it('returns the correct breached threshold when there are two of the same threshold value for positive number', () => {
      const expectColor = 'red';

      const thresholds: Threshold[] = [
        {
          color: expectColor,
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
        {
          color: 'yellow',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
      ];

      expect(getBreachedThreshold(2, thresholds)).toEqual(expect.objectContaining({ color: expectColor }));
    });

    it('returns the correct breached threshold when there are two of the same threshold value for negative value', () => {
      const expectColor = 'yellow';

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
        {
          color: expectColor,
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
      ];

      expect(getBreachedThreshold(-2, thresholds)).toEqual(expect.objectContaining({ color: expectColor }));
    });

    it('returns the most recently added threshold when there are two of the same threshold with the same value and comparison operator for the exact value', () => {
      const expectColor = 'yellow';

      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
        {
          color: expectColor,
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
        },
      ];

      expect(getBreachedThreshold(0, thresholds)).toEqual(expect.objectContaining({ color: expectColor }));
    });

    it('returns undefined when two of the same threshold value that does not equal to the exact value', () => {
      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
        {
          color: 'yellow',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
      ];

      expect(getBreachedThreshold(0, thresholds)).toBeNil();
    });

    it('returns the correct threshold when the data point is below two threshold of same value and above a threshold with less than operator', () => {
      const expectedColor = 'yellow';
      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: 28,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
        {
          color: expectedColor,
          value: 28,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
        {
          color: 'blue',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
      ];

      expect(getBreachedThreshold(26, thresholds)).toEqual(expect.objectContaining({ color: expectedColor }));
    });

    it('returns undefined when the point is outside of a band', () => {
      const thresholds: Threshold[] = [
        {
          color: 'red',
          value: 28,
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        },
        {
          color: 'blue',
          value: 0,
          comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        },
      ];

      expect(getBreachedThreshold(30, thresholds)).toBeNil();
    });
  });
});

describe('sort thresholds', () => {
  it('sort thresholds from least to greatest based on value', () => {
    const expectedSortedThresholds: Threshold[] = [
      {
        color: 'blue',
        value: 0,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
      {
        color: 'red',
        value: 2,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
      {
        color: 'yellow',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      },
    ];

    const thresholds: Threshold[] = [
      {
        color: 'red',
        value: 2,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
      {
        color: 'yellow',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      },
      {
        color: 'blue',
        value: 0,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
    ];

    // Make sure the original array is not altered
    expect(thresholds).not.toStrictEqual(expectedSortedThresholds);
    expect(sortThreshold(thresholds)).toStrictEqual(expectedSortedThresholds);
  });

  it('sort thresholds from least to greatest based on comparison operators order when the values are the same', () => {
    const expectedSortedThresholds: Threshold[] = [
      {
        color: 'blue',
        value: 0,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
      {
        color: 'yellow',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      },
      {
        color: 'red',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
      {
        color: 'purple',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      },
      {
        color: 'orange',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
      {
        color: 'black',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      },
    ];

    const thresholds: Threshold[] = [
      {
        color: 'black',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      },
      {
        color: 'orange',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
      {
        color: 'yellow',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      },
      {
        color: 'blue',
        value: 0,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
      {
        color: 'red',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
      {
        color: 'purple',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
      },
    ];

    // Make sure the original array is not altered
    expect(thresholds).not.toStrictEqual(expectedSortedThresholds);
    expect(sortThreshold(thresholds)).toStrictEqual(expectedSortedThresholds);
  });
});

describe('filter annotations', () => {
  it('should return only number annotations', () => {
    const annotations: Annotations = {
      y: [
        {
          color: 'red',
          value: 28,
        },
        {
          color: 'blue',
          value: 'TEST',
        },
      ],
    };

    const expectedAnnotations: Annotations = {
      y: [
        {
          color: 'red',
          value: 28,
        },
      ],
    };

    expect(getNumberAnnotations(annotations)).toStrictEqual(expectedAnnotations);
  });

  it('should return only number thresholds', () => {
    const thresholds: Threshold[] = [
      {
        color: 'red',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      },
      {
        color: 'blue',
        value: 'TEST',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      },
    ];

    const expectedThresholds: Threshold[] = [
      {
        color: 'red',
        value: 28,
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      },
    ];

    expect(getNumberThresholds(thresholds)).toStrictEqual(expectedThresholds);
  });
});
describe('thresholdAppliesToDataStream', () => {
  const threshold: Threshold = {
    color: 'red',
    value: 28,
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  };

  it('returns that threshold does apply, if threshold does not specify data stream ids', () => {
    expect(thresholdAppliesToDataStream(threshold, 'any-random-id')).toBeTrue();
  });

  it('returns that threshold does not apply, if threshold does specify data stream ids, and does not include the request id', () => {
    expect(
      thresholdAppliesToDataStream({ ...threshold, dataStreamIds: ['id-1', 'id-2'] }, 'any-random-id')
    ).toBeFalse();
  });

  it('returns that threshold does apply, if threshold does specify data stream ids, and does include the request id', () => {
    expect(thresholdAppliesToDataStream({ ...threshold, dataStreamIds: ['id-1', 'id-2'] }, 'id-2')).toBeTrue();
  });
});

const DATA_THRESHOLD: Threshold = {
  value: 12,
  color: 'red',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
};
const ALARM_THRESHOLD: Threshold = {
  value: 0,
  color: 'orange',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  severity: 1,
};

const ALARM_THRESHOLD_2: Threshold = {
  value: 1,
  color: 'yellow',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  severity: 2,
};

const ANNOTATION: Annotation<string> = {
  value: 'some-string',
  color: 'pink',
};

describe('highestPriorityThreshold', () => {
  it('returns undefined when passed no thresholds', () => {
    expect(highestPriorityThreshold([])).toBeUndefined();
  });

  it('returns only threshold if only one provided', () => {
    expect(highestPriorityThreshold([DATA_THRESHOLD])).toBe(DATA_THRESHOLD);
  });

  it('always return the threshold with the lowest severity', () => {
    expect(highestPriorityThreshold([ALARM_THRESHOLD, ALARM_THRESHOLD_2])).toBe(ALARM_THRESHOLD); // Has lower seveirty
  });

  it('always returns a threshold with a severity, over one without', () => {
    const LOW_SEVERITY = { ...ALARM_THRESHOLD, severity: 999999 };
    expect(highestPriorityThreshold([LOW_SEVERITY, DATA_THRESHOLD])).toBe(LOW_SEVERITY);
  });
});

describe('getThresholds', () => {
  it('returns nothing when given undefined', () => {
    expect(getThresholds(undefined)).toBeEmpty();
  });

  it('returns nothing when given empty object', () => {
    expect(getThresholds({})).toBeEmpty();
  });

  it('returns nothing when given no y annotations', () => {
    expect(getThresholds({ y: [] })).toBeEmpty();
  });

  it('returns nothing when only given annotations', () => {
    expect(getThresholds({ y: [ANNOTATION] })).toBeEmpty();
  });

  it('returns threshold', () => {
    expect(getThresholds({ y: [DATA_THRESHOLD] })).toEqual([DATA_THRESHOLD]);
  });

  it('returns only threshold', () => {
    expect(getThresholds({ y: [DATA_THRESHOLD, ANNOTATION] })).toEqual([DATA_THRESHOLD]);
  });
});
