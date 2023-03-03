import { h, JSX } from '@stencil/core';
import { SizeConfig } from '../../../utils/dataTypes';
import { LegendConfig } from '../common/types';
import { LEGEND_POSITION } from '../common/constants';

const chartLegendContainerClassName = 'chart-legend-container';

export const ChartLegendContainer = (
  {
    legendHeight,
    config,
    size: { height, marginRight, marginLeft, marginBottom, marginTop, width },
  }: { legendHeight: number; config: LegendConfig; size: SizeConfig },
  children: JSX.Element
) => {
  const sharedStyles = {
    position: 'relative',
    overflowY: 'scroll',
    msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
  };
  return config.position === LEGEND_POSITION.BOTTOM ? (
    <div
      class={chartLegendContainerClassName}
      style={{
        ...sharedStyles,
        top: `${height + marginTop + marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        height: `${legendHeight}px`,
        width: `${width}px`,
      }}
    >
      {children}
    </div>
  ) : (
    <div
      class={chartLegendContainerClassName}
      style={{
        ...sharedStyles,
        top: `${marginTop}px`,
        marginLeft: `${marginLeft + width + marginRight}px`,
        width: `${config.width}px`,
        marginRight: '0',
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  );
};
