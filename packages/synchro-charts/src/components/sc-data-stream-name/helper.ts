import update from 'immutability-helper';
import { aggregateToString } from '../../utils/aggregateToString';
import { convertMS } from '../../utils/time';

export const getAggregationFrequency = (dataResolution: number, aggregationType?: string) => {
  if (dataResolution === 0 || !aggregationType) {
    return 'raw data';
  }

  const { day, hour, minute, seconds } = convertMS(dataResolution);
  const getPlural = (input: number) => (input > 1 ? 's' : '');

  const aggregateString = aggregateToString(aggregationType);

  if (day !== 0) {
    return `${day} day${getPlural(day)} ${aggregateString}`;
  }
  if (hour !== 0) {
    return `${hour} hour${getPlural(hour)} ${aggregateString}`;
  }
  if (minute !== 0) {
    return `${minute} minute${getPlural(minute)} ${aggregateString}`;
  }
  if (seconds !== 0) {
    return `${seconds} second${getPlural(seconds)} ${aggregateString}`;
  }

  return 'N/A';
};

/**
 * Updated name value and it's associated data stream id
 *
 * Used to represent unpersisted editing state.
 */
export type NameValue = { id: string; name: string };

/**
 * Updates the `NameValue` it exists, otherwise creates a new `NameValue`.
 */
export const updateName = (names: NameValue[], name: string, id: string) => {
  const index = names.findIndex(o => o.id === id);
  if (index >= 0) {
    return update(names, { [index]: { $set: { id, name } } });
  }
  return [
    ...names,
    {
      name,
      id,
    },
  ];
};
