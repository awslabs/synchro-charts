import { Row } from '../constructTableData';
import { MessageOverrides, TableColumn } from '../../../utils/dataTypes';
export declare class ScTableBase {
    columns: TableColumn[];
    rows: Row[];
    isEnabled: boolean;
    liveModeOnlyMessage: string;
    messageOverrides: MessageOverrides;
    render(): any;
}
