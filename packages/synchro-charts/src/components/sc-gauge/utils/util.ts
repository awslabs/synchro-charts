export const FONT_SIZE = 48;
export const ICON_SIZE = 24;
export const LABEL_SIZE = 24;
export const UNIT_SIZE = 24;
export const GAUGE_THICKNESS = 34;
export const DIAMETER = 138;
export const STROKE_WIDTH = 1;

export const OUTRING_DIAMETER = 150;
export const OUTRING_INNER_DIAMETER = 144;
export const INNERRING_DIAMETER = 138;

export const CORNER_RADIUS = 4;
export const RADIAN = Math.PI / 180;

// Gauge each side is 20 degrees above 180 degrees, so total angle = 180 + 20 * 2
export const EACH_SIDE_ANGLE = 20;
export const TOTAL_ANGLE = 220;
export const GAUGE_HEIGHT = OUTRING_DIAMETER + Math.sin(EACH_SIDE_ANGLE * RADIAN) * OUTRING_DIAMETER;

// The right-most Angle of the horizontal is 0, and the starting Angle of gauge is 180 - 20 = 160 degrees.
export const INITIAL_ANGLE = 160;
export const INITIAL_RADIAN = -Math.PI * (TOTAL_ANGLE / 360);
export const END_RADIAN = Math.PI * (TOTAL_ANGLE / 360);
