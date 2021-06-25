import { YAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';

export const getY = ({
  annotation,
  height,
  viewPort,
}: {
  annotation: YAnnotation;
  height: number;
  viewPort: ViewPort;
}) => {
  const { yMax, yMin } = viewPort;
  return height - (((annotation.value as number) - yMin) * height) / (yMax - yMin);
};
