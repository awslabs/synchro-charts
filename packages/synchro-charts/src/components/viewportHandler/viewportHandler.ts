import { ViewPortManager } from './types';
import { SizeConfig } from '../../utils/dataTypes';

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
    [managerId: string]: { start: Date; end: Date; intervalId?: number; viewportGroup?: string };
  } = {};

  managers = (): T[] => {
    // NOTE: Providing new reference to a array to prevent manipulation of the internal array from the outside.
    return [...this.viewportManagers];
  };

  dispose = () => {
    this.viewportManagers.forEach(({ id }) => this.remove(id));
  };

  startTick = ({ manager, duration, chartSize }: { manager: T; duration: number; chartSize?: SizeConfig }): void => {
    // If chart size is null then it is KPI or Status Grid
    // We do not have to tick for those.
    if (chartSize == null) {
      return;
    }

    const initStart = new Date(new Date().getTime() - duration);
    const initEnd = new Date();
    const viewPortMapKey = manager.viewportGroup != null ? manager.viewportGroup : manager.id;
    const liveIdKey = manager.id;

    const tickRate = (1 / chartSize.width) * duration;
    // If we are adding a chart into an existing group
    // we do nothing because we have one clock for the whole group
    if (liveIdKey in this.viewportLiveId) {
      return;
    }

    this.viewportLiveId[liveIdKey] = {
      start: initStart,
      end: initEnd,
      viewportGroup: manager.viewportGroup,
    };
    this.viewportLiveId[liveIdKey].intervalId = (setInterval(() => {
      // shift forward by x amount of time
      // Create new start and end
      const { start, end } = this.viewportLiveId[liveIdKey];
      const newStart = new Date(start.getTime() + tickRate);
      const newEnd = new Date(end.getTime() + tickRate);

      // Sets the new start and end in the viewport live id for the current manager
      this.viewportLiveId[liveIdKey].start = newStart;
      this.viewportLiveId[liveIdKey].end = newEnd;
      this.viewportMap[viewPortMapKey] = { start: newStart, end: newEnd };
      // Have manager update its own viewport
      manager.updateViewPort({ start: newStart, end: newEnd, duration });
    }, tickRate) as unknown) as number;

    this.viewportMap[viewPortMapKey] = { start: initStart, end: initEnd };

    // Sync the chart to the new viewport so we dont need to delay the sync by wait for the interval tick
    this.syncViewPortGroup({
      start: initStart,
      end: initEnd,
      manager,
      duration,
    });
  };

  stopTick = ({ manager, viewportGroup }: { manager?: T; viewportGroup?: string }): void => {
    if (manager == null && viewportGroup == null) {
      return;
    }

    const clearInternalClock = (liveId: string): void => {
      if (this.viewportLiveId[liveId] == null) return;
      clearInterval(this.viewportLiveId[liveId].intervalId);
      delete this.viewportLiveId[liveId];
    };

    // Clear the internal clock for all viewports in a group
    if (viewportGroup != null) {
      Object.entries(this.viewportLiveId)
        .filter(([, item]) => item.viewportGroup === viewportGroup)
        .forEach(([liveId]) => clearInternalClock(liveId));
    } else if (manager != null) {
      // Clears an internal clock for a single viewport
      clearInternalClock(manager.id);
    }
  };

  add = ({
    manager,
    chartSize,
    duration,
    shouldSync = true,
  }: {
    manager: T;
    chartSize?: SizeConfig;
    duration?: number;
    shouldSync?: boolean;
  }) => {
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
      this.startTick({ manager, duration, chartSize });
    }
  };

  remove = (managerId: string) => {
    const v = this.viewportManagers.find(({ id }) => id === managerId);

    // Dispose of the chart scene to ensure that the memory is released
    if (v && v.dispose) {
      this.stopTick({ manager: v });
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
      this.stopTick({ manager, viewportGroup: manager.viewportGroup });
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
