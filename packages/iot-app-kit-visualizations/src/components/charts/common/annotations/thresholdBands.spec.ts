import { Threshold } from '../types';
import { thresholdBands } from './thresholdBands';
import { COMPARISON_OPERATOR } from '../constants';

it('returns 13 bands always', () => {
  const expectedLowerValue = 28;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedLowerValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);
  expect(bands).toHaveLength(13);
});

it('returns the correct bands for 1 threshold with greater than comparison operator', () => {
  const expectedLowerValue = 28;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedLowerValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);

  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedLowerValue,
      upper: Number.MAX_SAFE_INTEGER,
    })
  );
});

it('returns the correct bands for 1 threshold with less than comparison operator', () => {
  const expectedUpperValue = 28;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedUpperValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
    },
  ];

  const bands = thresholdBands(thresholds);

  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: Number.MIN_SAFE_INTEGER,
      upper: expectedUpperValue,
    })
  );
});

it('returns the correct bands for 2 thresholds with both greater than comparison operator', () => {
  const expectedFirstValue = 28;
  const expectedSecondValue = 20;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedFirstValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
    {
      color: 'blue',
      value: expectedSecondValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);

  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedFirstValue,
      upper: Number.MAX_SAFE_INTEGER,
    })
  );

  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [0, 0, 255],
      lower: expectedSecondValue,
      upper: expectedFirstValue,
    })
  );
});

it('returns the correct bands for 2 thresholds with both less than comparison operator', () => {
  const expectedFirstValue = 28;
  const expectedSecondValue = 20;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedFirstValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
    {
      color: 'blue',
      value: expectedSecondValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);

  // The band between the max safe integer and first threshold should not exist as it is less than operator
  expect(bands).not.toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedFirstValue,
      upper: Number.MAX_SAFE_INTEGER,
    })
  );

  // The first band should be between the two expected number
  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedSecondValue,
      upper: expectedFirstValue,
    })
  );

  // The second band should be between the lowest threshold and the min safe integer.
  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [0, 0, 255],
      lower: Number.MIN_SAFE_INTEGER,
      upper: expectedSecondValue,
    })
  );
});

it('returns the correct bands for 2 thresholds with first one with less than and second one with greater than comparison operator', () => {
  const expectedFirstValue = 28;
  const expectedSecondValue = 20;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedFirstValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
    {
      color: 'blue',
      value: expectedSecondValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);

  // Should not have a band that goes from the first threshold to max integer
  expect(bands).not.toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedFirstValue,
      upper: Number.MAX_SAFE_INTEGER,
    })
  );

  // The first band should be between the two expected number with the first threshold color.
  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedSecondValue,
      upper: expectedFirstValue,
    })
  );

  // There should be no band between the lowest threshold and the min safe integer.
  expect(bands).not.toContainEqual(
    expect.objectContaining({
      color: [0, 0, 255],
      lower: Number.MIN_SAFE_INTEGER,
      upper: expectedSecondValue,
    })
  );
});

it('returns the correct bands for 2 thresholds with first one with less than and second one with greater than comparison operator with both negative thresholds', () => {
  const expectedFirstValue = -18;
  const expectedSecondValue = -20;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedFirstValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
    {
      color: 'blue',
      value: expectedSecondValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);

  // Should not have a band that goes from the first threshold to max integer
  expect(bands).not.toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedFirstValue,
      upper: Number.MAX_SAFE_INTEGER,
    })
  );

  // The first band should be between the two expected number with the second threshold color.
  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [0, 0, 255],
      lower: expectedSecondValue,
      upper: expectedFirstValue,
    })
  );

  // There should be no band between the lowest threshold and the min safe integer.
  expect(bands).not.toContainEqual(
    expect.objectContaining({
      color: [0, 0, 255],
      lower: Number.MIN_SAFE_INTEGER,
      upper: expectedSecondValue,
    })
  );
});

it('returns the correct bands for 2 thresholds with first one with greater than and second one with less than comparison operator', () => {
  const expectedFirstValue = 28;
  const expectedSecondValue = 20;
  const thresholds: Threshold[] = [
    {
      color: 'orange',
      value: expectedFirstValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
    {
      color: 'blue',
      value: expectedSecondValue,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);

  // Should have a band that goes from the first threshold to max integer
  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedFirstValue,
      upper: Number.MAX_SAFE_INTEGER,
    })
  );

  // Should not have a band between two thresholds
  expect(bands).not.toContainEqual(
    expect.objectContaining({
      color: [255, 165, 0],
      lower: expectedSecondValue,
      upper: expectedFirstValue,
    })
  );

  // There should be a band between the lowest threshold and the min safe integer.
  expect(bands).toContainEqual(
    expect.objectContaining({
      color: [0, 0, 255],
      lower: Number.MIN_SAFE_INTEGER,
      upper: expectedSecondValue,
    })
  );
});

it('returns the correct bands for 10 thresholds of unsorted assorted comparison operator', () => {
  const thresholds: Threshold[] = [
    {
      color: '#4363d8',
      value: 3,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
    {
      color: '#00008B',
      value: -1,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
    {
      color: '#42d4f4',
      value: -3,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
    },
    {
      color: '#800000',
      value: 10,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
    {
      color: '#f58231',
      value: 8,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
    {
      color: '#ffe119',
      value: 6,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
    {
      color: '#000075',
      value: 5,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    },
    {
      color: '#dcbeff',
      value: 5,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
    {
      color: '#9370DB',
      value: -3,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
    {
      color: '#800080',
      value: 0,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    },
  ];

  const bands = thresholdBands(thresholds);

  expect(bands).toStrictEqual([
    { color: [128, 0, 0], lower: 10, upper: Number.MAX_SAFE_INTEGER },
    { color: [245, 130, 49], lower: 8, upper: 10 },
    { color: [0, 0, 117], lower: 6, upper: 8 },
    { color: [255, 225, 25], lower: 5, upper: 6 },
    { color: [255, 225, 25], lower: 5, upper: 5 },
    { color: [67, 99, 216], lower: 0, upper: 3 },
    { color: [0, 0, 139], lower: -1, upper: 0 },
    { color: [66, 212, 244], lower: -3, upper: -1 },
    { color: [66, 212, 244], lower: -3, upper: -3 },
    { color: [147, 112, 219], lower: Number.MIN_SAFE_INTEGER, upper: -3 },
    { color: [147, 112, 219], lower: Number.MIN_SAFE_INTEGER, upper: -3 },
    { color: [147, 112, 219], lower: Number.MIN_SAFE_INTEGER, upper: -3 },
    { color: [147, 112, 219], lower: Number.MIN_SAFE_INTEGER, upper: -3 },
  ]);
});

it('returns correct bands for EQ comparison', () => {
  const thresholds: Threshold[] = [
    {
      color: '#800000',
      value: 3.5675768878,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    },
    {
      color: '#800080',
      value: 100005,
      showValue: false,
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    },
  ];

  const bands = thresholdBands(thresholds);
  expect(bands).toStrictEqual([
    { color: [128, 0, 128], lower: 100005, upper: 100005 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
    { color: [128, 0, 0], lower: 3.5675768878, upper: 3.5675768878 },
  ]);
});
