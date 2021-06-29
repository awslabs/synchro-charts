import { ViewPortManager } from './types';
/**
 * Handlers the syncing view port across different view port groups.
 *
 * This allows us to have defined groupings of widgets which all efficiently have their viewports synced
 * without utilizing any framework level code.
 *
 * This allows us to have performant syncing of charts.
 */
export declare class ViewPortHandler<T extends ViewPortManager> {
    private viewPortManagers;
    private viewPortMap;
    managers: () => T[];
    dispose: () => void;
    add: (v: T, shouldSync?: boolean) => void;
    remove: (managerId: string) => void;
    /**
     * Sync all viewports sharing the group of the given chart scene, to have their viewport being at `start`,
     * and ending at `end`.
     *
     * preventPropagation - if true, then we sync all viewports to the provided viewport. Otherwise it only updates the handlers internal state.
     * manager - the manager which is the source of this syncing
     */
    syncViewPortGroup: ({ start, end, manager, preventPropagation, }: {
        start: Date;
        end: Date;
        manager: T;
        preventPropagation?: boolean | undefined;
    }) => void;
}
