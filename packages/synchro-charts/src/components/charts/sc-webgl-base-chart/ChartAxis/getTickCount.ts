import { ScaleConfig } from '../../common/types';
import { ScaleType } from '../../common/constants';
import { Size } from '../../../../utils/types';

const X_TICK_DISTANCE_PX = 100;
// Y ticks can be closer since the height of a label is much less than the max width of a label across multiple resolutions
const Y_TICK_DISTANCE_PX = 30;
const MIN_TICK_COUNT = 2;

export const getTickCount = (
  { width, height }: Size,
  { yScaleType }: ScaleConfig
): { xTickCount: number; yTickCount: number } => {
  const xTickCount = Math.max(Math.floor(width / X_TICK_DISTANCE_PX), MIN_TICK_COUNT);
  const yTickCount = Math.max(
    Math.floor(height / (Y_TICK_DISTANCE_PX + (yScaleType === ScaleType.Log ? 60 : 0))),
    MIN_TICK_COUNT
  );
  return { xTickCount, yTickCount };
};
