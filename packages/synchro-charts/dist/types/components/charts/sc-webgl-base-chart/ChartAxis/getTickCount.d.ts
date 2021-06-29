import { ScaleConfig } from '../../common/types';
import { Size } from '../../../../utils/types';
export declare const getTickCount: ({ width, height }: Size, { yScaleType }: ScaleConfig) => {
    xTickCount: number;
    yTickCount: number;
};
