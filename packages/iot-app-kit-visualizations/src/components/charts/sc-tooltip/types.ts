import { ActivePointWithType } from '../sc-webgl-base-chart/activePoints';
import { Primitive } from '../../../utils/dataTypes';

export type TooltipPoint = ActivePointWithType<Primitive> & { color?: string };

export type TooltipPositioning = { top: string; left: string; right: string; transform: string; x: number; y: number };
