import { ActivePointWithType } from '../sc-webgl-base-chart/activePoints';
import { Primitive } from '../../../utils/dataTypes';

export type TooltipPoint = ActivePointWithType<Primitive> & { color?: string };
