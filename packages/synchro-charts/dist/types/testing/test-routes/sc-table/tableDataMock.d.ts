import { DataStream, DataStreamInfo, TableColumn } from '../../../utils/dataTypes';
import { Annotations } from '../../../components/charts/common/types';
export declare const tableMockData: ({ tableDataLength, showLoading, showError, }: {
    tableDataLength?: number | undefined;
    showLoading?: boolean | undefined;
    showError?: boolean | undefined;
}) => {
    tableColumns: TableColumn[];
    dataStreamInfo: DataStreamInfo[];
    dataStreams: DataStream<import("../../../utils/dataTypes").Primitive>[];
    annotations: Annotations;
    errorMsg: string;
};
