import { getDistanceFromDuration } from './getDistanceFromDuration';

describe('get distance from duration', () => {
  it('should return distance between milliseconds ', () => {
    expect(getDistanceFromDuration(time => time * -2, 1000)).toBe(2000);
  });
});
