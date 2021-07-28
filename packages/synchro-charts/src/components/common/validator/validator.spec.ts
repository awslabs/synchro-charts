import { validate } from './validator';

it('is valid with an undefined viewport', () => expect(() => validate({ viewport: undefined })).not.toThrowError());

it('is valid with ISO date string viewport start and end', () =>
  expect(() =>
    validate({
      viewport: {
        start: new Date(),
        end: new Date().toISOString(),
      },
    })
  ).not.toThrowError());

it('is valid with valid duration string', () =>
  expect(() => validate({ viewport: { duration: '1h' } })).not.toThrowError());

it('throws an error if the viewport contains a string that is not an ISO time string', () =>
  expect(() =>
    validate({
      viewport: {
        start: 'you',
        end: 'shall not pass',
      },
    })
  ).toThrow(/Unable to parse/));

it('throws an error if the duration is not a valid duration string like 1h', () =>
  expect(() =>
    validate({
      viewport: {
        duration: 'oh noes',
      },
    })
  ).toThrow(/Unable to parse/));
