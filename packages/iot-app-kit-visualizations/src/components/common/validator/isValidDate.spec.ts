import { isValidDate } from './isValidDate';

it('returns true when its a date object', () => {
  expect(isValidDate(new Date())).toBeTrue();
});

it('returns true when the date string is in ISO format', () => {
  expect(isValidDate(new Date().toISOString())).toBeTrue();
});

it('returns false when date string is not a representation of a date', () => {
  expect(isValidDate('hello my name is oliver')).toBeFalse();
});

it('returns false when date string is not in ISO format', () => {
  expect(isValidDate(new Date().toString())).toBeFalse();
});
