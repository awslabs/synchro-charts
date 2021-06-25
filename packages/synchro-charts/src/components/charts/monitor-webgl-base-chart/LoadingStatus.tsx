import { h } from '@stencil/core';

const LOADING_SPINNER_SIZE_PX = 60;

export const LoadingStatus = ({ isLoading }: { isLoading: boolean }) => (
  <div
    style={{
      zIndex: '11',
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: isLoading ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    }}
  >
    {isLoading && <sc-loading-spinner size={LOADING_SPINNER_SIZE_PX} />}
  </div>
);
