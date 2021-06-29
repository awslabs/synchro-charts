import { TooltipPoint } from './types';
import { TrendResult } from '../common/trends/types';
import { DataStream } from '../../../utils/dataTypes';
export declare const trendLinePoints: ({ trendResults, dataStreams, displayedDate, }: {
    trendResults: TrendResult[];
    dataStreams: DataStream[];
    displayedDate: Date;
}) => TooltipPoint[];
