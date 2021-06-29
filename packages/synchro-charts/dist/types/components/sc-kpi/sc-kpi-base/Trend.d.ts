import { DataPoint } from '../../../utils/dataTypes';
export declare const Trend: ({ previousPoint: { y: prevY }, latestPoint: { y: latestY }, miniVersion, }: {
    previousPoint: DataPoint<number>;
    latestPoint: DataPoint<number>;
    miniVersion: boolean;
}) => any;
