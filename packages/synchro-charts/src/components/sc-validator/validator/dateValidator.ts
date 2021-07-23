import isISO8601 from 'validator/lib/isISO8601';

export const isValidDate = (date: Date | string): boolean => {
  if (date instanceof Date) {
    return true;
  }

  return isISO8601(date);
};
