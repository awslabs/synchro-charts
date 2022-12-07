import { NUMBER_STREAM_1, STRING_STREAM_1 } from '../../testing/__mocks__/mockWidgetProperties';
import { DefaultErrorMessages, DefaultMessages, ErrorMessageName } from './constants';
import {
  getData,
  getDeviationDataFlow,
  getErrorMessage,
  getPoint,
  getPropertyStream,
  getPropertyStreamErrorMessage,
  getViewportErrorMessage,
} from './formatStream';

describe('getViewportErrorMessage', () => {
  const VIEWPORT = { yMin: undefined, yMax: undefined };
  it('returns missingYminAndYmaxError string when yMin and yMax are undefined', () => {
    expect(getViewportErrorMessage()).toBe(ErrorMessageName.MISSING_YMIN_AND_MAX_ERROR);
  });

  it('returns missingYminError string when yMin is undefined', () => {
    const { yMin, yMax = 100 } = VIEWPORT;
    expect(getViewportErrorMessage(yMin, yMax)).toBe(ErrorMessageName.MISSING_YMIN_ERROR);
  });

  it('returns missingYmaxError string when yMax is undefined', () => {
    const { yMin = 0, yMax } = VIEWPORT;
    expect(getViewportErrorMessage(yMin, yMax)).toBe(ErrorMessageName.MISSING_YMAX_ERROR);
  });

  it('returns missingYmaxError string when yMin and yMax are the same', () => {
    const { yMin = 100, yMax = 100 } = VIEWPORT;
    expect(getViewportErrorMessage(yMin, yMax)).toBe(ErrorMessageName.INVALID_YMIN_AND_YMAX_ERROR);
  });
});

describe('getPropertyStreamErrorMessage', () => {
  it('returns missingYminAndYmaxError string when propertyStream did not provide', () => {
    expect(getPropertyStreamErrorMessage()).toBe(ErrorMessageName.INVALID_VALUE_ERROR);
  });

  it('returns missingYminAndYmaxError string when propertyStream provided', () => {
    const propertyStream = NUMBER_STREAM_1;
    expect(getPropertyStreamErrorMessage(propertyStream)).toBeEmpty();
  });
});

describe('getPropertyStream', () => {
  it('returns undefined string when propertyStream did not provide', () => {
    expect(getPropertyStream()).toBeUndefined();
  });

  it('returns propertyStream data when propertyStream provided and the `propertyStream` dataType is number', () => {
    const propertyStream = NUMBER_STREAM_1;
    expect(getPropertyStream(propertyStream)).toBe(propertyStream);
  });

  it('returns undefined when propertyStream provided and the `propertyStream` dataType is string', () => {
    const propertyStream = STRING_STREAM_1;
    expect(getPropertyStream(propertyStream)).toBeUndefined();
  });
});

describe('getPoint', () => {
  it('returns undefined string when `propertyPoint` and `propertyStream` did not provide', () => {
    expect(getPoint()).toBeUndefined();
  });

  it('returns propertyStream data when `propertyPoint` and `propertyStream` provided', () => {
    const propertyStream = NUMBER_STREAM_1;
    const propertyPoint = NUMBER_STREAM_1.data[0];
    expect(getPoint(propertyPoint, propertyStream)).toBe(propertyPoint);
  });
});

describe('getDeviationDataFlow', () => {
  describe.each`
    yMin   | yMax   | expected
    ${123} | ${123} | ${''}
    ${0}   | ${100} | ${100}
    ${10}  | ${100} | ${90}
    ${50}  | ${50}  | ${''}
    ${-50} | ${-30} | ${20}
    ${50}  | ${30}  | ${''}
  `('getDeviationDataFlow yMax - yMin', ({ yMin, yMax, expected }) => {
    test(`${yMax}  -  ${yMin}  is  ${expected}`, () => {
      expect(getDeviationDataFlow(yMin, yMax)).toBe(expected);
    });
  });
});

describe('getErrorMessage', () => {
  const viewport = { yMin: 0, yMax: 100, duration: 1000 };

  it('returns Invalid value when `propertyPoint` and `propertyStream` did not provide', () => {
    expect(getErrorMessage(viewport, DefaultMessages.error)).toBe(
      DefaultErrorMessages[ErrorMessageName.INVALID_VALUE_ERROR]
    );
  });

  it('returns undefined when `propertyPoint` and `propertyStream` provided', () => {
    expect(getErrorMessage(viewport, DefaultMessages.error, NUMBER_STREAM_1)).toBeEmpty();
  });

  it('returns `propertyStream`s error when `propertyPoint` and `propertyStream` provided and `propertyStream` provided `error`', () => {
    expect(getErrorMessage(viewport, DefaultMessages.error, { ...NUMBER_STREAM_1, error: 'Invalid' })).toBe('Invalid');
  });
});

describe('getData', () => {
  it('returns normal value', () => {
    const viewport = { yMin: 0, yMax: 200, duration: 1000 };
    const percent = NUMBER_STREAM_1.data[0].y / (viewport.yMax - viewport.yMin);
    const unit = NUMBER_STREAM_1.unit || '%';
    const value = percent * 100;
    expect(getData(viewport, NUMBER_STREAM_1.data[0], NUMBER_STREAM_1, 2)).toMatchObject({
      percent,
      unit,
      value: value.toString(),
    });
  });

  it('returns only value value when viewport has error message', () => {
    const viewport = { yMin: 100, yMax: 100, duration: 1000 };
    const percent = 0;
    const unit = '';
    const value = NUMBER_STREAM_1.data[0].y;
    expect(getData(viewport, NUMBER_STREAM_1.data[0], NUMBER_STREAM_1)).toMatchObject({
      percent,
      unit,
      value,
    });
  });
});
