import { h, JSX } from '@stencil/core';
import { SizeConfig } from '../../../utils/dataTypes';

/* Data Container is the tracking element used to draw our visualizations for this chart onto */
export const DataContainer = (
  { size: { width, height, marginLeft, marginTop } }: { size: SizeConfig },
  children: JSX.Element
) => (
  <div
    style={{
      width: `${width}px`,
      height: `${height}px`,
      marginLeft: `${marginLeft}px`,
      marginTop: `${marginTop}px`,
    }}
    class="data-container"
  >
    {children}
  </div>
);
