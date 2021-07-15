import { ViewPortManager } from './types';

/**
 * Handlers the syncing view port across different view port groups.
 *
 * This allows us to have defined groupings of widgets which all efficiently have their viewports synced
 * without utilizing any framework level code.
 *
 * This allows us to have performant syncing of charts.
 */
export class ViewportHandler<T extends ViewPortManager> {
  private viewportManagers: T[] = [];
  private viewportMap: {
    [viewportGroup: string]: { start: Date; end: Date };
  } = {};

  managers = (): T[] => {
    // NOTE: Providing new reference to a array to prevent manipulation of the internal array from the outside.
    return [...this.viewportManagers];
  };

  dispose = () => {
    this.viewportManagers.forEach(({ id }) => this.remove(id));
  };

  add = (v: T, shouldSync = true) => {
    this.viewportManagers = [...this.viewportManagers, v];

    /**
     * If the added chart scene is part of a view port group, sync it's viewport to
     * the current viewport groups time span.
     */
    if (v.viewportGroup && this.viewportMap[v.viewportGroup] && shouldSync) {
      v.updateViewPort(this.viewportMap[v.viewportGroup]);
    }
  };

  remove = (managerId: string) => {
    const v = this.viewportManagers.find(({ id }) => id === managerId);

    // Dispose of the chart scene to ensure that the memory is released
    if (v) {
      v.dispose();
    }

    // Remove manager from list of registered view port managers
    this.viewportManagers = this.viewportManagers.filter(({ id }) => id !== managerId);
  };

  /**
   * Sync all viewports sharing the group of the given chart scene, to have their viewport being at `start`,
   * and ending at `end`.
   *
   * preventPropagation - if true, then we sync all viewports to the provided viewport. Otherwise it only updates the handlers internal state.
   * manager - the manager which is the source of this syncing
   */
  syncViewPortGroup = ({
    start,
    end,
    manager,
    preventPropagation = false,
  }: {
    start: Date;
    end: Date;
    manager: T;
    preventPropagation?: boolean;
  }) => {
    if (manager.viewportGroup) {
      this.viewportMap[manager.viewportGroup] = { start, end };
    }

    if (!preventPropagation) {
      const updateViewPort = (v: T) => {
        v.updateViewPort({ start, end });
      };

      if (manager.viewportGroup) {
        /** Get all of the groups which belong within the viewport group */
        const managers = this.viewportManagers.filter(({ viewportGroup: group }) => manager.viewportGroup === group);

        /**  Sync all of the chart scenes within the viewport group. */
        managers.forEach(updateViewPort);
      } else {
        /**
         * No view port group defined, so only update the camera associated with the
         * scene which emitted the event (no syncing of other charts.)
         */
        updateViewPort(manager);
      }
    }
  };
}
