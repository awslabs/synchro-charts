import { DonutSizeConfig } from '../../common/types';

export type GuageOuterRing = {
  percent: number;
  value: number | string;
  showValue?: number | string;
  color: string;
};

export type GaugeSizeConfig = DonutSizeConfig & {
  gaugeThickness: number;
};
