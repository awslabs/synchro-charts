import { AggregateType } from '../../utils/dataTypes';
import { getAggregationFrequency, updateName } from './helper';
import { SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS } from '../../utils/time';
import { aggregateToString } from '../../utils/aggregateToString';

describe('aggregationFrequency', () => {
  const aggregationLevel = AggregateType.AVERAGE;
  const aggregateString = aggregateToString(aggregationLevel);
  it('returns 1 second aggregation frequency', () => {
    const aggregationFrequency = getAggregationFrequency(SECOND_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 second ${aggregateString}`);
  });

  it('returns more than 1 second aggregation frequency', () => {
    const aggregationFrequency = getAggregationFrequency(SECOND_IN_MS * 2, aggregationLevel);
    expect(aggregationFrequency).toBe(`2 seconds ${aggregateString}`);
  });

  it('returns 1 min aggregation frequency', () => {
    const aggregationFrequency = getAggregationFrequency(MINUTE_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 minute ${aggregateString}`);
  });

  it('returns more than 1 min aggregation frequency', () => {
    const aggregationFrequency = getAggregationFrequency(MINUTE_IN_MS * 2, aggregationLevel);
    expect(aggregationFrequency).toBe(`2 minutes ${aggregateString}`);
  });

  it('returns 1 hr aggregation frequency', () => {
    const aggregationFrequency = getAggregationFrequency(HOUR_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 hour ${aggregateString}`);
  });

  it('returns more than 1 hr aggregation frequency', () => {
    const aggregationFrequency = getAggregationFrequency(HOUR_IN_MS * 2, aggregationLevel);
    expect(aggregationFrequency).toBe(`2 hours ${aggregateString}`);
  });

  it('returns 1 day aggregation frequency', () => {
    const aggregationFrequency = getAggregationFrequency(DAY_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 day ${aggregateString}`);
  });

  it('returns N/A for time span less than a second', () => {
    const aggregationFrequency = getAggregationFrequency(20, aggregationLevel);
    expect(aggregationFrequency).toBe('N/A');
  });
});

describe('updateName', () => {
  it('should correctly update name', () => {
    const NAME_1 = { id: '1', name: 'Cardinal wind direction 1' };
    const NAME_2 = { id: '2', name: 'Cardinal wind direction 2' };
    const NEW_NAME = 'wind 1';
    expect(updateName([NAME_1, NAME_2], NEW_NAME, NAME_1.id)).toEqual([{ ...NAME_1, name: NEW_NAME }, NAME_2]);
  });

  it('updates name of last item', () => {
    const NAME_1 = { id: '1', name: 'Cardinal wind direction 1' };
    const NAME_2 = { id: '2', name: 'Cardinal wind direction 2' };
    const NEW_NAME = 'wind 1';
    expect(updateName([NAME_1, NAME_2], NEW_NAME, NAME_2.id)).toEqual([NAME_1, { ...NAME_2, name: NEW_NAME }]);
  });
});
