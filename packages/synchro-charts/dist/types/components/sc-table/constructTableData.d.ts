import { DataStream, Primitive, TableColumn } from '../../utils/dataTypes';
import { Threshold } from '../charts/common/types';
import { StatusIcon } from '../charts/common/constants';
export interface Cell {
    dataStream?: DataStream<Primitive>;
    color?: string;
    icon?: StatusIcon;
}
export interface Row {
    [columnHeader: string]: Cell | undefined;
}
export declare const cell: (thresholds: Threshold[], date: Date, dataStreams: DataStream[], dataStreamId: string | undefined) => Cell;
/**
 * Given the business models, output the view model representation of a table row.
 */
export declare const constructTableData: ({ tableColumns, dataStreams, thresholds, date, }: {
    tableColumns: TableColumn[];
    dataStreams: DataStream[];
    thresholds: Threshold[];
    date: Date;
}) => Row[];
/**
 * Format liveModeOnlyMessage for Table disable State display
 */
export declare const formatLiveModeOnlyMessage: (liveModeOnlyMessage: string) => {
    msgHeader: string;
    msgSubHeader: string;
};
