import { ConnectedComponentPageGenerator } from './types';
export interface ConnectedComponentOptions {
    status?: {
        errors?: boolean;
        loading?: boolean;
    };
    size?: {
        size?: boolean;
    };
}
export declare const describeConnectedComponents: (pageGenerator: ConnectedComponentPageGenerator, tag: string, options?: Partial<ConnectedComponentOptions>) => void;
