import { h } from '@stencil/core';
import { SizeConfig } from '../../../utils/dataTypes';

export const ErrorStatus = ({ hasError, size: { marginLeft, width } }: { hasError: boolean; size: SizeConfig }) => {
  return hasError ? (
    <div style={{ position: 'absolute', width: `${width}px` }}>
      <div
        class="awsui-util-mt-s"
        style={{
          left: `${marginLeft}px`,
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'row-reverse',
        }}
      >
        <sc-error-badge>Stopped</sc-error-badge>
      </div>
    </div>
  ) : (
    <div data-test-tag="error-badge-place-holder" style={{ display: 'none' }} />
  );
};
