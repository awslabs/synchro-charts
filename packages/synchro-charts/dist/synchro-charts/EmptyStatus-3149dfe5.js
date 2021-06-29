import { h } from './index-44bccbc7.js';
import { a as NO_DATA_STREAMS_PRESENT_HEADER, b as NO_DATA_STREAMS_PRESENT_SUB_HEADER, c as NO_DATA_PRESENT_HEADER, d as NO_DATA_PRESENT_SUB_HEADER } from './terms-d11f73d5.js';

/**
 * Provider messaging to clarify that the chart has no data/streams present
 */
const EmptyStatus = ({ isLoading, hasNoDataPresent, hasNoDataStreamsPresent, messageOverrides, displaysNoDataPresentMsg, }) => (h("div", { class: "empty-status", style: ((!(hasNoDataPresent || hasNoDataStreamsPresent) || isLoading) && { display: 'none' }) || undefined },
    !isLoading &&
        hasNoDataStreamsPresent && [
        h("h3", null, messageOverrides.noDataStreamsPresentHeader || NO_DATA_STREAMS_PRESENT_HEADER),
        messageOverrides.noDataStreamsPresentSubHeader || NO_DATA_STREAMS_PRESENT_SUB_HEADER,
    ],
    !isLoading &&
        displaysNoDataPresentMsg &&
        !hasNoDataStreamsPresent &&
        hasNoDataPresent && [
        h("h3", null, messageOverrides.noDataPresentHeader || NO_DATA_PRESENT_HEADER),
        messageOverrides.noDataPresentSubHeader || NO_DATA_PRESENT_SUB_HEADER,
    ]));

export { EmptyStatus as E };
