import { MinimalViewPortConfig } from './dataTypes';

export const viewPortStartDate = ({ start, end, duration }: MinimalViewPortConfig): Date => {
  if (start) {
    return start;
  }
  if (end && duration != null) {
    return new Date(end.getTime() - duration);
  }
  if (duration != null) {
    return new Date(Date.now() - duration);
  }
  // This should never actually occur, either you have a start, or you have a duration
  return new Date(Date.now());
};

export const viewPortEndDate = ({ start, end, duration }: MinimalViewPortConfig): Date => {
  if (end) {
    return end;
  }
  if (start && duration != null) {
    return new Date(start.getTime() + duration);
  }

  return new Date(Date.now());
};
