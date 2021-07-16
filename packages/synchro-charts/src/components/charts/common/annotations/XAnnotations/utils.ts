import { XAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';

export const getX = ({
  annotation,
  width,
  viewport,
}: {
  annotation: XAnnotation;
  width: number;
  viewport: ViewPort;
}) => {
  const { start, end } = viewport;

  return Math.floor((width / (end.getTime() - start.getTime())) * (annotation.value.getTime() - start.getTime()));
};
