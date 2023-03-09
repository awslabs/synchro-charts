import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../../components';
import { CustomHTMLElement } from '../../../../utils/types';
import { update } from '../../common/tests/merge';
import { ScThresholdLegend } from './sc-threshold-legend';
import { ScThresholdLegendRow } from './sc-threshold-legend-row';
import { Threshold } from '../../common/types';
import { COMPARISON_OPERATOR } from '../../common/constants';

const thresholdLegendSpecPage = async (propOverrides: Partial<Components.IotAppKitVisThresholdLegend> = {}) => {
  const page = await newSpecPage({
    components: [ScThresholdLegend, ScThresholdLegendRow],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const thresholdLegend = page.doc.createElement('iot-app-kit-vis-threshold-legend') as CustomHTMLElement<
    Components.IotAppKitVisThresholdLegend
  >;
  const props: Partial<Components.IotAppKitVisThresholdLegend> = {
    thresholds: [],
    ...propOverrides,
  };

  update(thresholdLegend, props);
  page.body.appendChild(thresholdLegend);

  await page.waitForChanges();

  return { page, thresholdLegend };
};

const THRESHOLD: Threshold = {
  value: 'ALARM',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  color: 'red',
};

const NUMBER_THRESHOLD: Threshold<number> = {
  value: 123,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  color: 'blue',
};

it('renders one row per threshold when one threshold present', async () => {
  const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: [THRESHOLD] });

  expect(thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row')).toHaveLength(1);
});

it('renders the threshold legend row correctly', async () => {
  const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: [THRESHOLD] });

  const row = thresholdLegend.querySelector(
    'iot-app-kit-vis-threshold-legend-row'
  ) as HTMLIotAppKitVisThresholdLegendRowElement;
  expect(row.label).toEqual(THRESHOLD.value);
  expect(row.color).toBe(THRESHOLD.color);
  expect(row.innerText).toContain(THRESHOLD.value);
});

describe('order', () => {
  it('renders rows in the order the thresholds are provided - part 1', async () => {
    const THRESHOLDS = [NUMBER_THRESHOLD, THRESHOLD];
    const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: THRESHOLDS });

    const rows = thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row');

    expect(rows[0].label).toBe(`y < ${THRESHOLDS[0].value}`);
    expect(rows[1].label).toBe(THRESHOLDS[1].value);
  });

  it('renders rows in the order the thresholds are provided - part 2 (reversed order of input from part 1)', async () => {
    const THRESHOLDS = [THRESHOLD, NUMBER_THRESHOLD];
    const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: THRESHOLDS });

    const rows = thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row');

    expect(rows[0].label).toBe(THRESHOLDS[0].value);
    expect(rows[1].label).toBe(`y < ${THRESHOLDS[1].value}`);
  });
});

describe('renders operators correctly', () => {
  it('renders correctly when GTE', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({
      thresholds: [{ ...THRESHOLD, comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL }],
    });

    const row = thresholdLegend.querySelector(
      'iot-app-kit-vis-threshold-legend-row'
    ) as HTMLIotAppKitVisThresholdLegendRowElement;
    expect(row.label).toEqual(`y >= ${THRESHOLD.value}`);
  });

  it('renders correctly when GT', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({
      thresholds: [{ ...THRESHOLD, comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN }],
    });

    const row = thresholdLegend.querySelector(
      'iot-app-kit-vis-threshold-legend-row'
    ) as HTMLIotAppKitVisThresholdLegendRowElement;
    expect(row.label).toEqual(`y > ${THRESHOLD.value}`);
  });

  it('renders correctly when LTE', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({
      thresholds: [{ ...THRESHOLD, comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL }],
    });

    const row = thresholdLegend.querySelector(
      'iot-app-kit-vis-threshold-legend-row'
    ) as HTMLIotAppKitVisThresholdLegendRowElement;
    expect(row.label).toEqual(`y <= ${THRESHOLD.value}`);
  });

  it('renders correctly when LT', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({
      thresholds: [{ ...THRESHOLD, comparisonOperator: COMPARISON_OPERATOR.LESS_THAN }],
    });

    const row = thresholdLegend.querySelector(
      'iot-app-kit-vis-threshold-legend-row'
    ) as HTMLIotAppKitVisThresholdLegendRowElement;
    expect(row.label).toEqual(`y < ${THRESHOLD.value}`);
  });
});

it('renders the threshold legend row color box as the thresholds color', async () => {
  const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: [THRESHOLD] });

  const box = thresholdLegend.querySelector('iot-app-kit-vis-threshold-legend-row .box') as HTMLDivElement;

  expect(box).not.toBeNull();
  expect(box.style.backgroundColor).toEqual(THRESHOLD.color);
});

it('renders one row per threshold when two thresholds present', async () => {
  const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: [THRESHOLD, NUMBER_THRESHOLD] });

  expect(thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row').length).toBe(2);
});

describe('de-duplication behavior for legend rows', () => {
  it('renders one row for multiple thresholds that would render identical rows', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: [THRESHOLD, THRESHOLD] });

    expect(thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row').length).toBe(1);
  });

  it('renders two rows for two unique thresholds out of three', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({ thresholds: [THRESHOLD, THRESHOLD, NUMBER_THRESHOLD] });

    expect(thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row').length).toBe(2);
  });

  it('renders two rows for two unique thresholds that only differ in color', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({
      thresholds: [
        { ...THRESHOLD, color: 'red' },
        { ...THRESHOLD, color: 'blue' },
      ],
    });

    expect(thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row').length).toBe(2);
  });

  it('renders two rows for two unique thresholds that only differ in value', async () => {
    const { thresholdLegend } = await thresholdLegendSpecPage({
      thresholds: [
        { ...THRESHOLD, value: 'A' },
        { ...THRESHOLD, value: 'B' },
      ],
    });

    expect(thresholdLegend.querySelectorAll('iot-app-kit-vis-threshold-legend-row').length).toBe(2);
  });
});
