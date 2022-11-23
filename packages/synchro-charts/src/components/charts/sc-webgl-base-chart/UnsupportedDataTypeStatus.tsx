import { h } from '@stencil/core';
import { DataType } from '../../../utils/dataConstants';
import { MessageOverrides, SizeConfig } from '../../../utils/dataTypes';

/**
 * Provide messaging to clarify that the data/stream has invalid DataType(s)
 */
export const UnsupportedDataTypeStatus = ({
  supportedDataTypes,
  messageOverrides,
  size,
}: {
  supportedDataTypes: DataType[];
  messageOverrides: MessageOverrides;
  size: SizeConfig;
}) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = size;
  return (
    <div
      id="unsupported-data-type-error"
      class="unsupported-data-type-status"
      style={{
        width: `${width + marginLeft + marginRight}px`,
        height: `${height + marginBottom + marginTop}px`,
        padding: '24px',
        background: 'white',
        border: 'solid 4px black',
      }}
    >
      <h2>{messageOverrides.unsupportedDataTypeHeader || 'Unable to render your data'}</h2>
      <h2>{messageOverrides.unsupportedDataTypeSubHeader || 'This chart only supports the following DataType(s):'}</h2>
      <div>{messageOverrides.supportedTypes || supportedDataTypes.map(type => <div>{type}</div>)}</div>
    </div>
  );
};
