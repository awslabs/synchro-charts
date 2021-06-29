import { T as TREND_TYPE } from './dataConstants-a26ff694.js';
import { a as getDataPoints } from './utils-11cae6c8.js';
import { a as getVisibleData } from './dataFilters-8fe55407.js';

const TREND_LINE_STROKE_WIDTH = 2;
const TREND_LINE_DASH_ARRAY = '4, 7';
const getTrendLabel = (dataStreamName, trendType) => {
    let trendTypeLabel;
    switch (trendType) {
        case TREND_TYPE.LINEAR:
            trendTypeLabel = 'linear';
            break;
        default:
            /* eslint-disable-next-line no-console */
            console.warn(`No label associated with trend type ${trendType}.`);
            trendTypeLabel = 'trend';
    }
    return `${dataStreamName} (${trendTypeLabel})`;
};

/**
 * Determines the ideal least-squares line of best fit over a given data set.
 * @param data The data stream over which to compute the linear regression.
 */
const linearRegression = (data) => {
    const dataPoints = data.data;
    const len = dataPoints.length;
    if (len === 0) {
        return null;
    }
    const startDate = dataPoints[0].x;
    let sumX = 0;
    let sumY = 0;
    let sumXX = 0;
    let sumXY = 0;
    for (let i = 0; i < len; i += 1) {
        const { x, y } = dataPoints[i];
        const time = x - startDate;
        sumX += time;
        sumY += y;
        sumXX += time * time;
        sumXY += time * y;
    }
    const run = len * sumXX - sumX * sumX;
    const rise = len * sumXY - sumX * sumY;
    const gradient = run === 0 ? 0 : rise / run;
    const intercept = sumY / len - (gradient * sumX) / len;
    return {
        type: TREND_TYPE.LINEAR,
        dataStreamId: data.id,
        equation: { gradient, intercept },
        startDate: new Date(startDate),
    };
};
/**
 * Reads in a data stream and a trend type, then computes the trend result.
 * @param data The data stream over which to compute the trend.
 * @param trendType The type of trend to compute.
 */
const computeTrendResult = (dataStream, trendType) => {
    switch (trendType) {
        case TREND_TYPE.LINEAR:
            return linearRegression(dataStream);
        default:
            /* eslint-disable-next-line no-console */
            console.error(`Unable to compute trend result for trend type '${trendType}'.`);
            return null;
    }
};
/**
 * Computes trend results for all requested trends using the data in the provided viewport (including boundary points).
 */
const getAllTrendResults = (viewPort, dataStreams, trends) => {
    const trendResults = [];
    dataStreams.forEach(stream => {
        const { id } = stream;
        const dataPoints = getDataPoints(stream, stream.resolution);
        // only compute a trend line if there are at least two visible and/or boundary data points, the reason being that
        // a trend line based on a single point of data has no informational value and may actually be misleading
        const dataInViewport = getVisibleData(dataPoints, viewPort);
        if (dataInViewport.length >= 2) {
            trends
                .filter(({ dataStreamId }) => id === dataStreamId)
                .forEach(({ type, color }) => {
                const trendResult = computeTrendResult(Object.assign(Object.assign({}, stream), { data: dataInViewport }), type);
                if (trendResult) {
                    trendResults.push(Object.assign(Object.assign({}, trendResult), { color }));
                }
            });
        }
    });
    return trendResults;
};
/**
 * Calculates the value of the given trend result at the requested date.
 */
const getTrendValue = (trendResult, timestamp) => {
    switch (trendResult.type) {
        case TREND_TYPE.LINEAR:
            return ((timestamp - trendResult.startDate.getTime()) * trendResult.equation.gradient + trendResult.equation.intercept);
        default:
            throw new Error(`Cannot compute trend value for trend of type '${trendResult.type}' on data stream ${trendResult.dataStreamId}.`);
    }
};

export { TREND_LINE_DASH_ARRAY as T, TREND_LINE_STROKE_WIDTH as a, getAllTrendResults as b, getTrendLabel as c, getTrendValue as g };
