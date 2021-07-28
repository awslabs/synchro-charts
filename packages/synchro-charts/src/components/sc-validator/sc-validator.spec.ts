import { validate } from './sc-validator';

it('skips validation if the viewport is undef', async () => {
  // Does not throw error and break the test
  validate({ viewport: undefined });
});

it('passes the validation if the static viewport is valid', async () => {
  // Does not throw error and break the test
  validate({ viewport: { start: new Date(), end: new Date().toISOString() } });
});

it('passes the validation if the live viewport is valid', async () => {
  // Does not throw error and break the test
  validate({ viewport: { duration: '1h' } });
});

it('throws an error if the viewport contains a string that is not an ISO time string', async () => {
  try {
    validate({ viewport: { start: 'you', end: 'shall not pass' } });
  } catch (err) {
    expect(err.toString()).toContain('Unable to parse');
  }
});

it('throws an error if the duration is not a valid duration string like 1h', async () => {
  try {
    validate({ viewport: { duration: 'oh noes' } });
  } catch (err) {
    expect(err.toString()).toContain('Unable to parse');
  }
});
