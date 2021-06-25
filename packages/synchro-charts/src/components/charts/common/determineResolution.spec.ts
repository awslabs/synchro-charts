import { determineResolution } from './determineResolution';
import { DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS, SECOND_IN_MS, YEAR_IN_MS } from '../../../utils/time';

const START_DATE = new Date(2000, 0, 0);
const END_DATE = new Date(2000, 0, 1);
const RESOLUTIONS = [SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS, YEAR_IN_MS];

describe('determination of resolution for data fetching', () => {
  it('picks zero resolution when viewing a small view port', () => {
    expect(
      determineResolution({
        supportedResolutions: [0, SECOND_IN_MS],
        viewPortStartDate: START_DATE,
        viewPortEndDate: new Date(2000, 0, 0, 0, 5),
        maxPoints: 100,
      })
    ).toBe(0);
  });

  it('picks the only available resolution if only one resolution available', () => {
    expect(
      determineResolution({
        supportedResolutions: [SECOND_IN_MS],
        viewPortStartDate: START_DATE,
        viewPortEndDate: END_DATE,
        maxPoints: 1,
      })
    ).toBe(SECOND_IN_MS);
  });

  it('returns minute resolution when max points points is equal to the number of minutes in a day', () => {
    expect(
      determineResolution({
        supportedResolutions: RESOLUTIONS,
        viewPortStartDate: START_DATE,
        viewPortEndDate: END_DATE,
        maxPoints: DAY_IN_MS / MINUTE_IN_MS,
      })
    ).toBe(MINUTE_IN_MS);
  });

  it('returns hour resolution when 24 points are requested in a day', () => {
    expect(
      determineResolution({
        supportedResolutions: RESOLUTIONS,
        viewPortStartDate: START_DATE,
        viewPortEndDate: END_DATE,
        maxPoints: DAY_IN_MS / HOUR_IN_MS,
      })
    ).toBe(HOUR_IN_MS);
  });

  it('returns hour resolution when slightly more than 24 points are requested in a day', () => {
    expect(
      determineResolution({
        supportedResolutions: RESOLUTIONS,
        viewPortStartDate: START_DATE,
        viewPortEndDate: END_DATE,
        maxPoints: 30,
      })
    ).toBe(HOUR_IN_MS);
  });

  it('returns day resolution when max points is less than the number of hours per day', () => {
    expect(
      determineResolution({
        supportedResolutions: RESOLUTIONS,
        viewPortStartDate: START_DATE,
        viewPortEndDate: END_DATE,
        maxPoints: 23,
      })
    ).toBe(DAY_IN_MS);
  });

  it('throws error when there are no supported resolutions', () => {
    expect(() =>
      determineResolution({
        supportedResolutions: [],
        viewPortStartDate: START_DATE,
        viewPortEndDate: END_DATE,
        maxPoints: 1000,
      })
    ).toThrowError('resolution');
  });
});
