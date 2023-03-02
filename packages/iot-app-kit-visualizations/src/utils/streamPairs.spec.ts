import { streamPairs, removePairedAlarms } from './streamPairs';
import {
  ALARM_STREAM,
  DATA_STREAM,
  DATA_STREAM_2,
  DATA_WITH_ALARM_ASSOCIATION,
} from '../testing/__mocks__/mockWidgetProperties';

describe('removePairedAlarms', () => {
  it('returns nothing when given nothing', () => {
    expect(removePairedAlarms([])).toBeEmpty();
  });

  it('returns property stream', () => {
    expect(removePairedAlarms([DATA_STREAM])).toEqual([DATA_STREAM]);
  });

  it('returns alarm stream', () => {
    expect(removePairedAlarms([ALARM_STREAM])).toEqual([ALARM_STREAM]);
  });

  it('returns only property stream when given an alarm and property stream which are associated', () => {
    expect(removePairedAlarms([ALARM_STREAM, DATA_WITH_ALARM_ASSOCIATION])).toEqual([DATA_WITH_ALARM_ASSOCIATION]);
  });

  it('return both infos when not associated', () => {
    expect(removePairedAlarms([ALARM_STREAM, DATA_STREAM])).toEqual([ALARM_STREAM, DATA_STREAM]);
  });

  it('retains order of passed in property infos', () => {
    expect(removePairedAlarms([ALARM_STREAM, DATA_WITH_ALARM_ASSOCIATION, DATA_STREAM_2])).toEqual([
      DATA_WITH_ALARM_ASSOCIATION,
      DATA_STREAM_2,
    ]);

    // Switched up order, reflected in output
    expect(removePairedAlarms([DATA_STREAM_2, ALARM_STREAM, DATA_WITH_ALARM_ASSOCIATION])).toEqual([
      DATA_STREAM_2,
      DATA_WITH_ALARM_ASSOCIATION,
    ]);
  });
});

describe('streamPairs', () => {
  it('returns nothing when no infos', () => {
    expect(streamPairs([])).toBeEmpty();
  });

  it('returns lone property', () => {
    expect(streamPairs([DATA_STREAM])).toEqual([{ property: DATA_STREAM }]);
  });

  it('returns lone alarm', () => {
    expect(streamPairs([ALARM_STREAM])).toEqual([{ alarm: ALARM_STREAM }]);
  });

  it('returns paired alarm and property', () => {
    expect(streamPairs([ALARM_STREAM, DATA_WITH_ALARM_ASSOCIATION])).toEqual([
      { alarm: ALARM_STREAM, property: DATA_WITH_ALARM_ASSOCIATION },
    ]);
  });

  it('does not pair non-associated alarm', () => {
    expect(streamPairs([ALARM_STREAM, DATA_STREAM])).toEqual([{ alarm: ALARM_STREAM }, { property: DATA_STREAM }]);
  });
});
