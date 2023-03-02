import { YAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';

export const getY = ({
  annotation,
  height,
  viewport,
}: {
  annotation: YAnnotation;
  height: number;
  viewport: ViewPort;
}) => {
  const { yMax, yMin } = viewport;
  return height - (((annotation.value as number) - yMin) * height) / (yMax - yMin);
};
