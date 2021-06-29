import { StatusIcon } from '../constants';
interface Icons {
    [statusIcon: string]: Function;
}
export declare const icons: Icons;
export declare const getIcons: (name: StatusIcon, color?: string | undefined, size?: number | undefined) => any;
export {};
