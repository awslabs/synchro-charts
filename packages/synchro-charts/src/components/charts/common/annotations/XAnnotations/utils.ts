import { XAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';

export const getX = ({
  annotation,
  width,
  viewPort,
}: {
  annotation: XAnnotation;
  width: number;
  viewPort: ViewPort;
}) => {
  const { start, end } = viewPort;

  return Math.floor((width / (end.getTime() - start.getTime())) * (annotation.value.getTime() - start.getTime()));
};
