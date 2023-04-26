import { h } from '@stencil/core';
import { DataType } from '../../../utils/dataConstants';
import { MessageOverrides, SizeConfig } from '../../../utils/dataTypes';

/**
 * Provide messaging to clarify that the data/stream has invalid DataType(s)
 */
export const UnsupportedDataTypeStatus = ({
  supportedDataTypes,
  messageOverrides,
  hasUnsupportedData,
  size,
}: {
  supportedDataTypes: DataType[];
  messageOverrides: MessageOverrides;
  hasUnsupportedData: boolean;
  size: SizeConfig;
}) => {
  const { width, height } = size;

  if (!hasUnsupportedData) return <div />;

  return (
    <div
      id="unsupported-data-type-error"
      class="unsupported-data-type-status"
      style={{
        width: `${width}px`,
        height: `${height}px`,
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
