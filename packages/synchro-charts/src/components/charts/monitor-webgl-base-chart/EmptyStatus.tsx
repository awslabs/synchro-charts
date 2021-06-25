import { h } from '@stencil/core';
import {
  NO_DATA_PRESENT_HEADER,
  NO_DATA_PRESENT_SUB_HEADER,
  NO_DATA_STREAMS_PRESENT_HEADER,
  NO_DATA_STREAMS_PRESENT_SUB_HEADER,
} from '../../common/terms';
import { MessageOverrides } from '../../../utils/dataTypes';

/**
 * Provider messaging to clarify that the chart has no data/streams present
 */
export const EmptyStatus = ({
  isLoading,
  hasNoDataPresent,
  hasNoDataStreamsPresent,
  messageOverrides,
  displaysNoDataPresentMsg,
}: {
  isLoading: boolean;
  hasNoDataPresent: boolean;
  hasNoDataStreamsPresent: boolean;
  messageOverrides: MessageOverrides;
  displaysNoDataPresentMsg: boolean;
}) => (
  <div
    class="empty-status"
    style={((!(hasNoDataPresent || hasNoDataStreamsPresent) || isLoading) && { display: 'none' }) || undefined}
  >
    {!isLoading &&
      hasNoDataStreamsPresent && [
        <h3>{messageOverrides.noDataStreamsPresentHeader || NO_DATA_STREAMS_PRESENT_HEADER}</h3>,
        messageOverrides.noDataStreamsPresentSubHeader || NO_DATA_STREAMS_PRESENT_SUB_HEADER,
      ]}
    {!isLoading &&
      displaysNoDataPresentMsg &&
      !hasNoDataStreamsPresent &&
      hasNoDataPresent && [
        <h3>{messageOverrides.noDataPresentHeader || NO_DATA_PRESENT_HEADER}</h3>,
        messageOverrides.noDataPresentSubHeader || NO_DATA_PRESENT_SUB_HEADER,
      ]}
  </div>
);
