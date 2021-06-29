import { b as breachedThreshold } from './breachedThreshold-ae43cec9.js';

const cell = (thresholds, date, dataStreams, dataStreamId) => {
    const stream = dataStreams.find(({ id }) => id === dataStreamId);
    const value = stream && stream.data[stream.data.length - 1] && stream.data[stream.data.length - 1].y;
    const threshold = stream &&
        breachedThreshold({
            value,
            date,
            dataStreams,
            dataStream: stream,
            thresholds,
        });
    const { color, icon } = threshold || {};
    return { dataStream: stream, color, icon };
};
/**
 * Given the business models, output the view model representation of a table row.
 */
const constructTableData = ({ tableColumns, dataStreams, thresholds, date, }) => {
    const numRows = Math.max(...tableColumns.map(({ rows }) => rows.length));
    const table = [];
    // eslint-disable-next-line no-plusplus
    for (let r = 0; r < numRows; r++) {
        const row = {};
        tableColumns.forEach(column => {
            const dataStreamId = column.rows[r] || undefined;
            row[column.header] = cell(thresholds, date, dataStreams, dataStreamId);
        });
        table.push(row);
    }
    return table;
};
/**
 * Format liveModeOnlyMessage for Table disable State display
 */
const formatLiveModeOnlyMessage = (liveModeOnlyMessage) => {
    const splitIndex = liveModeOnlyMessage.indexOf('. ');
    if (splitIndex < 0) {
        return { msgHeader: liveModeOnlyMessage, msgSubHeader: '' };
    }
    const msgHeader = liveModeOnlyMessage.slice(0, splitIndex);
    const msgSubHeader = liveModeOnlyMessage.slice(splitIndex + 2);
    return { msgHeader, msgSubHeader };
};

export { constructTableData as c, formatLiveModeOnlyMessage as f };
