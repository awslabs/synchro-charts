import { Cell } from '../constructTableData';
import { Primitive } from '../../../utils/dataTypes';
export declare class ScTableCell {
    cell: Cell | undefined;
    /**
     * Return the most recent value from the data stream present.
     *
     * If no such value exists, returns `undefined`.
     */
    value: () => Primitive | undefined;
    render(): any;
}
