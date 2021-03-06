import { getAggregationFrequency, updateName } from './helper';
import { SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS } from '../../utils/time';

describe('aggregationFrequency', () => {
  it('returns 1 second aggregation frequency', () => {
    const aggregationLevel = 'average';
    const aggregationFrequency = getAggregationFrequency(SECOND_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 second ${aggregationLevel}`);
  });

  it('returns more than 1 second aggregation frequency', () => {
    const aggregationLevel = 'average';
    const aggregationFrequency = getAggregationFrequency(SECOND_IN_MS * 2, aggregationLevel);
    expect(aggregationFrequency).toBe(`2 seconds ${aggregationLevel}`);
  });

  it('returns 1 min aggregation frequency', () => {
    const aggregationLevel = 'average';
    const aggregationFrequency = getAggregationFrequency(MINUTE_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 minute ${aggregationLevel}`);
  });

  it('returns more than 1 min aggregation frequency', () => {
    const aggregationLevel = 'average';
    const aggregationFrequency = getAggregationFrequency(MINUTE_IN_MS * 2, aggregationLevel);
    expect(aggregationFrequency).toBe(`2 minutes ${aggregationLevel}`);
  });

  it('returns 1 hr aggregation frequency', () => {
    const aggregationLevel = 'average';
    const aggregationFrequency = getAggregationFrequency(HOUR_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 hour ${aggregationLevel}`);
  });

  it('returns more than 1 hr aggregation frequency', () => {
    const aggregationLevel = 'average';
    const aggregationFrequency = getAggregationFrequency(HOUR_IN_MS * 2, aggregationLevel);
    expect(aggregationFrequency).toBe(`2 hours ${aggregationLevel}`);
  });

  it('returns 1 day aggregation frequency', () => {
    const aggregationLevel = 'average';
    const aggregationFrequency = getAggregationFrequency(DAY_IN_MS, aggregationLevel);
    expect(aggregationFrequency).toBe(`1 day ${aggregationLevel}`);
  });

  it('returns N/A for time span less than a second', () => {
    const aggregationLevel = 'average';
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
