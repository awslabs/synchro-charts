import { DAY_IN_MS } from './time';
import { viewPortEndDate, viewPortStartDate } from './viewPort';

const mockCurrentTime = (mockedDate: Date) => {
  // @ts-ignore
  Date.now = jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.getTime());
};

describe('viewPortStart', () => {
  it('returns start date if one is present', () => {
    const START = new Date(2000, 0, 0);
    expect(viewPortStartDate({ start: START })).toBe(START);
  });

  it('returns start date calculated from the end minus the duration', () => {
    expect(viewPortStartDate({ end: new Date(2000, 0, 1), duration: DAY_IN_MS })).toEqual(new Date(2000, 0, 0));
  });

  it('returns current date if empty viewport is provided', () => {
    const CURR_DATE = new Date();
    mockCurrentTime(CURR_DATE);

    expect(viewPortStartDate({})).toEqual(CURR_DATE);
  });
});

describe('viewPortEnd', () => {
  it('returns end date if one is present', () => {
    const END = new Date(2000, 0, 0);
    expect(viewPortEndDate({ end: END })).toBe(END);
  });

  it('returns end date calculated from the start plus the duration', () => {
    expect(viewPortEndDate({ start: new Date(2000, 0, 0), duration: DAY_IN_MS })).toEqual(new Date(2000, 0, 1));
  });

  it('returns current date if empty viewport is provided', () => {
    const CURR_DATE = new Date();
    mockCurrentTime(CURR_DATE);

    expect(viewPortEndDate({})).toEqual(CURR_DATE);
  });
});
