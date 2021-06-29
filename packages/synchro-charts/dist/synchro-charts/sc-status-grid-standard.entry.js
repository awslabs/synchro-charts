import { r as registerInstance, h } from './index-44bccbc7.js';
import { C as COMPARISON_OPERATOR, a as StatusIcon } from './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS, Y as YEAR_IN_MS } from './time-f374952b.js';
import { i as isNumeric } from './number-0c56420d.js';

/**
 * Construct a search query which embeds the test case parameters we wish to utilize.
 *
 * Use this to construct test route URLs for integration testing.
 */
const constructSearchQuery = ({ latestValue = undefined, threshold = undefined, showIcon = false, isEnabled = true, numDataStreams = 1, showValue = true, showName = true, showUnit = true, isEditing = false, }) => `threshold=${threshold}&showIcon=${showIcon}&isEnabled=${isEnabled}&latestValue=${String(latestValue)}&numDataStreams=${numDataStreams}&showValue=${showValue}&showUnit=${showUnit}&showName=${showName}&isEditing=${isEditing}`;
const parsePrimitive = (param) => {
    if (param == null || param === 'null' || param === 'undefined') {
        return null;
    }
    if (isNumeric(param)) {
        return Number.parseInt(param, 10);
    }
    return param;
};
/**
 * Parse the URL Search Query to construct models to build a test case out of.
 */
const testCaseParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isEnabledParam = urlParams.get('isEnabled');
    const latestValueParam = urlParams.get('latestValue');
    const numDataStreamsParam = urlParams.get('numDataStreams');
    const showNameParam = urlParams.get('showName');
    const showValueParam = urlParams.get('showValue');
    const showUnitParam = urlParams.get('showUnit');
    const isEditingParam = urlParams.get('isEditing');
    const thresholdValue = parsePrimitive(urlParams.get('threshold'));
    const showIconParam = urlParams.get('showIcon');
    /**
     * Parse Param
     */
    let latestValue;
    if (latestValueParam == null || latestValueParam === 'null' || latestValueParam === 'undefined') {
        latestValue = null;
    }
    else if (isNumeric(latestValueParam)) {
        latestValue = Number.parseInt(latestValueParam, 10);
    }
    else {
        latestValue = latestValueParam;
    }
    const numDataStreams = numDataStreamsParam && isNumeric(numDataStreamsParam) ? Number.parseInt(numDataStreamsParam, 10) : 1;
    const isEnabled = isEnabledParam !== 'false';
    const isEditing = isEditingParam !== 'false';
    const showName = showNameParam !== 'false';
    const showValue = showValueParam !== 'false';
    const showUnit = showUnitParam !== 'false';
    const showIcon = showIconParam !== 'false';
    /** Construct threshold */
    let threshold;
    if (thresholdValue != null) {
        threshold = {
            comparisonOperator: COMPARISON_OPERATOR.EQUAL,
            color: 'red',
            value: thresholdValue,
            icon: showIcon ? StatusIcon.NORMAL : undefined,
        };
    }
    return {
        threshold,
        latestValue,
        numDataStreams,
        isEnabled,
        labelsConfig: { showName, showValue, showUnit },
        isEditing,
    };
};

const { threshold, latestValue, numDataStreams, isEnabled, labelsConfig, isEditing } = testCaseParameters();
// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const NUM_POINTS = 3;
const DATA_TYPE = typeof latestValue === 'string' ? DataType.STRING : DataType.NUMBER;
// test data point dead center of the viewport
const DATA = new Array(NUM_POINTS).fill(null).map((_, i) => ({
    x: X_MIN.getTime() + MONTH_IN_MS * (i + 1),
    y: i === NUM_POINTS - 1 && latestValue != null ? latestValue : Y_MIN + 100 * (i + 1),
}));
const data = new Array(numDataStreams).fill(null).map((_, i) => ({
    id: i.toString(),
    data: i === 0 && latestValue != null ? DATA : [],
    color: 'black',
    unit: 'unit',
    name: `Data ${i + 1}`,
    dataType: DATA_TYPE,
    resolution: 0,
}));
const ScStatusGridStandard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const annotations = threshold ? { y: [threshold] } : undefined;
        return (h("sc-status-grid", { widgetId: "test-widget", labelsConfig: labelsConfig, annotations: annotations, dataStreams: data, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX, duration: isEnabled ? YEAR_IN_MS : undefined }, isEditing: isEditing }));
    }
};

export { ScStatusGridStandard as sc_status_grid_standard };
