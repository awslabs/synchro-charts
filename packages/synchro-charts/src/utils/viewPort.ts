import { MinimalViewPortConfig } from './dataTypes';
import { isMinimalStaticViewPort } from './predicates';
import { parseDuration } from './time';

export const viewportStartDate = (viewportConfig: MinimalViewPortConfig): Date =>
  isMinimalStaticViewPort(viewportConfig)
    ? new Date(viewportConfig.start)
    : new Date(Date.now() - parseDuration(viewportConfig.duration));

export const viewportEndDate = (viewportConfig: MinimalViewPortConfig): Date => {
  return isMinimalStaticViewPort(viewportConfig) ? new Date(viewportConfig.end) : new Date(Date.now());
};
