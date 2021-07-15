import colorString from 'color-string';

export const getCSSColorByString = (color: string) => {
  const cssColor = colorString.get(color);
  if (cssColor == null) {
    // eslint-disable-next-line no-console
    console.error(`provided an invalid color string, '${color}'`);
  }
  return cssColor == null ? [0, 0, 0] : cssColor.value;
};
