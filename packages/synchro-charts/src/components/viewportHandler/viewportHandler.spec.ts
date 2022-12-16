import uuid from 'uuid/v4';

import { ViewportHandler } from './viewportHandler';
import { ViewPortManager } from './types';
import { SECOND_IN_MS } from '../../utils/time';
import { SizeConfig } from '../../utils/dataTypes';

const viewportManager = (viewportGroup?: string): ViewPortManager => ({
  id: uuid(),
  updateViewPort: jest.fn(),
  viewportGroup,
  dispose: jest.fn(),
});

it('has no managers when initially created', () => {
  const groups = new ViewportHandler();
  expect(groups.managers()).toBeEmpty();
});

it('appends manager when added', () => {
  const groups = new ViewportHandler();
  const manager = viewportManager();

  groups.add({ manager });

  expect(groups.managers()).toEqual([manager]);
});

it('is empty after removing all managers from the group', () => {
  const groups = new ViewportHandler();
  const manager = viewportManager();

  groups.add({ manager });
  groups.remove(manager.id);

  expect(groups.managers()).toBeEmpty();
});

it('disposes of all managers when the group is disposed', () => {
  const groups = new ViewportHandler();

  const manager1 = viewportManager();
  const manager2 = viewportManager();

  groups.add({ manager: manager1 });
  groups.add({ manager: manager2 });

  groups.dispose();

  /** Every manager is disposed */
  expect(manager1.dispose).toBeCalled();
  expect(manager2.dispose).toBeCalled();
});

describe('syncing managers', () => {
  it('updates all managers with the same view port group', () => {
    const groups = new ViewportHandler();

    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);
    const VIEWPORT_GROUP = 'viewport-group';

    /** Add two managers to the same view port group */
    const manager1 = viewportManager(VIEWPORT_GROUP);
    const manager2 = viewportManager(VIEWPORT_GROUP);
    groups.add({ manager: manager1 });
    groups.add({ manager: manager2 });

    /** Sync the view port group of the first manager */
    groups.syncViewPortGroup({ start: START, end: END, manager: manager1 });

    /** Manager 1 is updated */
    expect(manager1.updateViewPort).toBeCalledTimes(1);
    expect(manager1.updateViewPort).toBeCalledWith(expect.objectContaining({ start: START, end: END }));

    /** Manager 2 is updated */
    expect(manager2.updateViewPort).toBeCalledTimes(1);
    expect(manager2.updateViewPort).toBeCalledWith(expect.objectContaining({ start: START, end: END }));
  });

  it('always updates any managers when syncViewPortGroup is called', () => {
    const groups = new ViewportHandler();

    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);
    const VIEWPORT_GROUP = 'viewport-group';

    /** Add two managers to the same view port group */
    const manager1 = viewportManager(VIEWPORT_GROUP);
    const manager2 = viewportManager(VIEWPORT_GROUP);
    groups.add({ manager: manager1 });
    groups.add({ manager: manager2 });

    /** Sync the view port group of the first manager */
    groups.syncViewPortGroup({ start: START, end: END, manager: manager1 });

    expect(manager1.updateViewPort).toBeCalled();
    expect(manager2.updateViewPort).toBeCalled();
  });

  it('does not update manager not in same view port group', () => {
    const groups = new ViewportHandler();

    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);

    const manager1 = viewportManager('group-1');
    const manager2 = viewportManager('group-2');

    /** Add two managers with different view port groups to the collection of managers */
    groups.add({ manager: manager1 });
    groups.add({ manager: manager2 });

    groups.syncViewPortGroup({ start: START, end: END, manager: manager1 });

    /** The manager which initiated the view port sync is updated */
    expect(manager1.updateViewPort).toBeCalledTimes(1);
    expect(manager1.updateViewPort).toBeCalledWith(expect.objectContaining({ start: START, end: END }));

    /** The other manager, which is in a different view port group, is not updated */
    expect(manager2.updateViewPort).not.toBeCalled();
  });

  it('a manager in no view port group does not sync to any other managers', () => {
    const groups = new ViewportHandler();

    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);

    const manager1 = viewportManager(undefined);
    const manager2 = viewportManager(undefined);

    groups.add({ manager: manager1 });
    groups.add({ manager: manager2 });

    groups.syncViewPortGroup({ start: START, end: END, manager: manager1 });

    expect(manager1.updateViewPort).toBeCalledTimes(1);
    expect(manager1.updateViewPort).toBeCalledWith(expect.objectContaining({ start: START, end: END }));

    expect(manager2.updateViewPort).not.toBeCalled();
  });

  it('a manager added to an existing view port group that has had view ports updated, will have the managers viewport updated to match the existing managers view ports', () => {
    const groups = new ViewportHandler();

    const VIEWPORT_GROUP = 'view-port-group';
    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);

    const manager1 = viewportManager(VIEWPORT_GROUP);
    const manager2 = viewportManager(VIEWPORT_GROUP);

    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1 });
    groups.syncViewPortGroup({ start: START, end: END, manager: manager1 });

    groups.add({ manager: manager2 });

    /** manager added to existing view port group that has had it's viewport synced should have it's viewport synced to the group */
    expect(manager2.updateViewPort).toBeCalledTimes(1);
    expect(manager2.updateViewPort).toBeCalledWith({ start: START, end: END });
  });

  it('will not update viewport when syncUpdate is false', () => {
    const groups = new ViewportHandler();

    const VIEWPORT_GROUP = 'view-port-group';
    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);

    const manager1 = viewportManager(VIEWPORT_GROUP);
    const manager2 = viewportManager(VIEWPORT_GROUP);

    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1 });
    groups.syncViewPortGroup({ start: START, end: END, manager: manager1 });

    groups.add({ manager: manager2, shouldSync: false });

    /** No view port update sense should sync is false */
    expect(manager2.updateViewPort).not.toBeCalled();
  });

  it('a manager added to a non existing view port group does not have its view port updated', () => {
    const groups = new ViewportHandler();

    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const VIEWPORT_GROUP_2 = 'view-port-group-2';
    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);

    const manager1 = viewportManager(VIEWPORT_GROUP_1);
    const manager2 = viewportManager(VIEWPORT_GROUP_2);

    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1 });
    groups.syncViewPortGroup({ start: START, end: END, manager: manager1 });

    /** add a manager which is not in the same view port group as the established view port group */
    groups.add({ manager: manager2 });

    /** manager added to existing view port group that has had it's viewport synced should have it's viewport synced to the group */
    expect(manager2.updateViewPort).not.toBeCalled();
  });

  it('blocks dateRangeChanged event emission when a duration is passed in', () => {
    const groups = new ViewportHandler();

    const VIEWPORT_GROUP = 'view-port-group-1';
    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);

    const manager = viewportManager(VIEWPORT_GROUP);

    groups.add({ manager });

    groups.syncViewPortGroup({ start: START, end: END, manager: manager, duration: 60000 });

    expect(manager.updateViewPort).toBeCalledWith(
      expect.objectContaining({
        shouldBlockDateRangeChangedEvent: true,
      })
    );
  });
});

describe('internal clock', () => {
  // When adding and creating new viewport with live mode, we make an extra call to ensure that the viewport is synced correctly
  const LIVE_RENDER_MULTIPLIER = 1;
  const chartSize: SizeConfig = {
    width: 10, // for the purpose of this test suite, only width matter
    height: 1,
    marginRight: 1,
    marginLeft: 1,
    marginTop: 1,
    marginBottom: 1,
  };

  it('starts the internal clock for a single manager in single viewport group when duration is passed in', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const manager = viewportManager(VIEWPORT_GROUP_1);

    /** Create a viewport group and sync it's viewport */
    groups.add({ manager, duration: 10 * SECOND_IN_MS, chartSize });

    const secondsElapsed = 3.8;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    expect(manager.updateViewPort).toBeCalledTimes(Math.floor(secondsElapsed) + LIVE_RENDER_MULTIPLIER);
  });

  it('does not start an internal clock for a single manager in viewport group when duration is not passed in', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const manager = viewportManager(VIEWPORT_GROUP_1);

    /** Create a viewport group and sync it's viewport */
    groups.add({ manager, shouldSync: false, chartSize });

    const secondsElapsed = 3.8;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    expect(manager.updateViewPort).toBeCalledTimes(0);
  });

  it('starts the internal clock for multiple managers in single viewport group when duration is passed in', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const manager1 = viewportManager(VIEWPORT_GROUP_1);
    const manager2 = viewportManager(VIEWPORT_GROUP_1);
    const duration = 10 * SECOND_IN_MS;
    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1, duration, chartSize });
    groups.add({ manager: manager2, duration, chartSize });

    const secondsElapsed = 3.8;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    // Added an extra one at the end because when we add manger2, the same viewport group, we sync up manger 1 as well.
    expect(manager1.updateViewPort).toBeCalledTimes(Math.floor(secondsElapsed) + LIVE_RENDER_MULTIPLIER + 1);
    // manger 2 has to be called 1 more because we had to sync the viewport when it first join. Add an extra 1 at the end because when adding to an exising group, we sync the newly added manger
    expect(manager2.updateViewPort).toBeCalledTimes(Math.floor(secondsElapsed) + LIVE_RENDER_MULTIPLIER + 1);
  });

  it('stops the internal clock for single manger in a single viewport when the stop tick method is called', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const manager = viewportManager(VIEWPORT_GROUP_1);

    /** Create a viewport group and sync it's viewport */
    groups.add({ manager, duration: 10 * SECOND_IN_MS });

    const secondsElapsed = 3.8;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    groups.stopTick(manager);
    // @ts-ignore
    manager.updateViewPort.mockClear();
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    expect(manager.updateViewPort).toBeCalledTimes(0);
  });

  it('stops the internal clock for multiple managers in a single viewport group when the stop tick method is called for one single manger', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const manager1 = viewportManager(VIEWPORT_GROUP_1);
    const manager2 = viewportManager(VIEWPORT_GROUP_1);
    const duration = 10 * SECOND_IN_MS;
    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1, duration });
    groups.add({ manager: manager2, duration });

    const secondsElapsed = 3.8;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    groups.stopTick(manager1);
    // @ts-ignore
    manager1.updateViewPort.mockClear();
    // @ts-ignore
    manager2.updateViewPort.mockClear();
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    expect(manager1.updateViewPort).toBeCalledTimes(0);
    expect(manager2.updateViewPort).toBeCalledTimes(0);
  });

  it('does not stop the internal clock for manager in a different viewport group', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const VIEWPORT_GROUP_2 = 'view-port-group-2';
    const manager1 = viewportManager(VIEWPORT_GROUP_1);
    const manager2 = viewportManager(VIEWPORT_GROUP_2);
    const duration = 10 * SECOND_IN_MS;
    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1, duration, chartSize });
    groups.add({ manager: manager2, duration, chartSize });

    const secondsElapsed = 3.2;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    groups.stopTick(manager1);
    // @ts-ignore
    manager1.updateViewPort.mockClear();
    // @ts-ignore
    manager2.updateViewPort.mockClear();

    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    expect(manager1.updateViewPort).toBeCalledTimes(0);
    expect(manager2.updateViewPort).toBeCalledTimes(Math.floor(secondsElapsed));
  });

  it('does not create an internal clock for viewport group that does not have duration', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const VIEWPORT_GROUP_2 = 'view-port-group-2';
    const manager1 = viewportManager(VIEWPORT_GROUP_1);
    const manager2 = viewportManager(VIEWPORT_GROUP_2);
    const duration = 10 * SECOND_IN_MS;
    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1, duration, chartSize });
    groups.add({ manager: manager2, chartSize });

    const secondsElapsed = 3.2;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    expect(manager1.updateViewPort).toBeCalledTimes(Math.floor(secondsElapsed) + LIVE_RENDER_MULTIPLIER);
    expect(manager2.updateViewPort).toBeCalledTimes(0);
  });

  it('renders more frequently for charts with greater width, given the same duration', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const VIEWPORT_GROUP_2 = 'view-port-group-2';
    const manager1 = viewportManager(VIEWPORT_GROUP_1);
    const manager2 = viewportManager(VIEWPORT_GROUP_2);
    const duration = 10 * SECOND_IN_MS;
    /** Create a viewport group and sync it's viewport */
    groups.add({ manager: manager1, duration, chartSize: { ...chartSize, width: 100 } });
    groups.add({ manager: manager2, duration, chartSize: { ...chartSize, width: 5 } });

    const secondsElapsed = 3.2;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    // manager 1 renders / ticks more frequently because it has greater width and image fidelity so it needs to
    // tick more often than manager 2 to show movement.
    // @ts-ignore
    expect(manager1.updateViewPort.mock.calls.length).toBeGreaterThan(manager2.updateViewPort.mock.calls.length);
  });

  it('blocks dateRangeChanged event emission when a duration is passed in', () => {
    jest.useFakeTimers();
    const groups = new ViewportHandler();
    const VIEWPORT_GROUP_1 = 'view-port-group-1';
    const manager = viewportManager(VIEWPORT_GROUP_1);

    /** Create a viewport group and sync it's viewport */
    groups.add({ manager, duration: 10 * SECOND_IN_MS, chartSize });

    const secondsElapsed = 1;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    expect(manager.updateViewPort).toBeCalledWith(
      expect.objectContaining({
        shouldBlockDateRangeChangedEvent: true,
      })
    );
  });
});
