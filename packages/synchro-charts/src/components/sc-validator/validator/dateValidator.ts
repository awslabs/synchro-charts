import isISO8601 from 'validator/lib/isISO8601';

export const isValidDate = (date: Date | string): boolean => (date instanceof Date ? true : isISO8601(date));
