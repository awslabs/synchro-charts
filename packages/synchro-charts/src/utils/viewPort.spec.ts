import { DAY_IN_MS } from './time';
import { viewportEndDate, viewportStartDate } from './viewPort';

const mockCurrentTime = (mockedDate: Date) => {
  // @ts-ignore
  Date.now = jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.getTime());
};

describe('viewportStart', () => {
  it('returns start date if one is present', () => {
    const START = new Date(2000, 0, 0);
    expect(viewportStartDate({ start: START })).toBe(START);
  });

  it('returns start date calculated from the end minus the duration', () => {
    expect(viewportStartDate({ end: new Date(2000, 0, 1), duration: DAY_IN_MS })).toEqual(new Date(2000, 0, 0));
  });

  it('returns current date if empty viewport is provided', () => {
    const CURR_DATE = new Date();
    mockCurrentTime(CURR_DATE);

    expect(viewportStartDate({})).toEqual(CURR_DATE);
  });
});

describe('viewportEnd', () => {
  it('returns end date if one is present', () => {
    const END = new Date(2000, 0, 0);
    expect(viewportEndDate({ end: END })).toBe(END);
  });

  it('returns end date calculated from the start plus the duration', () => {
    expect(viewportEndDate({ start: new Date(2000, 0, 0), duration: DAY_IN_MS })).toEqual(new Date(2000, 0, 1));
  });

  it('returns current date if empty viewport is provided', () => {
    const CURR_DATE = new Date();
    mockCurrentTime(CURR_DATE);

    expect(viewportEndDate({})).toEqual(CURR_DATE);
  });
});
