export const avg = (nums: number[]): number => nums.reduce((total, x) => total + x, 0) / nums.length;

export const standardDeviation = (values: number[]): number => {
  const average = avg(values);
  const avgSquareDiff = avg(values.map(value => (value - average) ** 2));
  return Math.sqrt(avgSquareDiff);
};
const SHIFT_KEY_CODE = 16;

// NOTE: Unable to get holding shift to work :-(
export const clickAndDrag = ({
  xStart,
  yStart,
  xEnd,
  yEnd,
}: {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
}) => {
  cy.get('.data-container')
    .trigger('keydown', {
      key: 'Shift',
      which: SHIFT_KEY_CODE,
      code: 'ShiftLeft',
      release: false,
    })
    .wait(20)
    .trigger('mousemove', { clientX: xStart, clientY: yStart })
    .trigger('mousedown', { which: 0 })
    .trigger('mousemove', { clientX: xEnd, clientY: yEnd })
    .trigger('mouseup', { force: true })
    .trigger('keyup', { key: 'Shift', which: SHIFT_KEY_CODE, code: 'ShiftLeft', release: false });

  cy.wait(100);
};
