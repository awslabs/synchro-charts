import { SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { Axis } from '../common/types';
export interface AxisRendererProps {
    container: SVGElement;
    size: SizeConfig;
    viewPort: ViewPort;
    axis?: Axis.Options;
}
export declare const renderAxis: () => ({ container, viewPort, size, axis }: AxisRendererProps) => void;
