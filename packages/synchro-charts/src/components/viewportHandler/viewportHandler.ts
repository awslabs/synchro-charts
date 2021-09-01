import { ViewPortManager } from './types';
import { SECOND_IN_MS } from '../../utils/time';

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
  private viewportLiveId: {
    [viewportGroup: string]: number;
  } = {};

  managers = (): T[] => {
    // NOTE: Providing new reference to a array to prevent manipulation of the internal array from the outside.
    return [...this.viewportManagers];
  };

  dispose = () => {
    this.viewportManagers.forEach(({ id }) => this.remove(id));
  };

  startTick = (v: T, duration: number): void => {
    const initStart = new Date(new Date().getTime() - duration);
    const initEnd = new Date();
    const key = v.viewportGroup != null ? v.viewportGroup : v.id;

    // If we are adding a chart into an existing group
    // we do nothing because we have one clock for the whole group
    if (this.viewportLiveId[key] != null) {
      return;
    }

    this.viewportMap[key] = { start: initStart, end: initEnd };

    this.viewportLiveId[key] = (setInterval(() => {
      // shift forward by x amount of time
      const { start, end } = this.viewportMap[key];
      const newStart = new Date(start.getTime() + SECOND_IN_MS);
      const newEnd = new Date(end.getTime() + SECOND_IN_MS);

      this.syncViewPortGroup({
        start: newStart,
        end: newEnd,
        duration,
        manager: v,
      });
      // TODO: fine tune the tick interval.
    }, SECOND_IN_MS) as unknown) as number;
  };

  stopTick = (manager: T): void => {
    const key = manager.viewportGroup != null ? manager.viewportGroup : manager.id;
    clearInterval(this.viewportLiveId[key]);
    delete this.viewportLiveId[key];
  };

  add = ({ manager, duration, shouldSync = true }: { manager: T; duration?: number; shouldSync?: boolean }) => {
    this.viewportManagers = [...this.viewportManagers, manager];

    /**
     * If the added chart scene is part of a view port group, sync it's viewport to
     * the current viewport groups time span.
     */
    if (manager.viewportGroup && this.viewportMap[manager.viewportGroup] && shouldSync) {
      manager.updateViewPort(this.viewportMap[manager.viewportGroup]);
    }
    // If duration is not null, this means that we want to have live mode
    if (duration != null) {
      this.startTick(manager, duration);
    }
  };

  remove = (managerId: string) => {
    const v = this.viewportManagers.find(({ id }) => id === managerId);

    // Dispose of the chart scene to ensure that the memory is released
    if (v && v.dispose) {
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
    duration,
    preventPropagation = false,
  }: {
    start: Date;
    end: Date;
    manager: T;
    duration?: number;
    preventPropagation?: boolean;
  }) => {
    const key = manager.viewportGroup ? manager.viewportGroup : manager.id;
    // Either you are in a group or you are a single chart
    this.viewportMap[key] = { start, end };

    if (duration == null) {
      this.stopTick(manager);
    }

    if (!preventPropagation) {
      const updateViewPort = (v: T) => {
        v.updateViewPort({ start, end, duration });
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
