import { RectScrollFixed } from '../../../utils/types';

const X = 100;
const Y = 100;
const HEIGHT = 50;
const WIDTH = 76;

const DEFAULT: RectScrollFixed = {
  x: X,
  y: Y,
  width: WIDTH,
  height: HEIGHT,
  left: X,
  top: Y,
  right: X + WIDTH,
  bottom: Y + HEIGHT,
  density: 1,
};

export const renderChild = (renderFunction: Function) => renderFunction(DEFAULT);
