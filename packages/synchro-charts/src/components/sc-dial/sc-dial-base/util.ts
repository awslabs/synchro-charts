export enum sizeConfigurations {
  BLUE = '#2E72B5',
  NORMAL = '#3F7E23',
  WARNING = '#F29D38',
  CRITICAL = '#C03F25',
  GRAY = '#D9D9D9',
  PRIMARYTEXT = '#16191f',
  SECONDARYTEXT = '#687078',
}

export const enum SizeFont {
  Huge = 'Huge',
  XL = 'XL',
  L = 'L',
  M = 'M',
  S = 'S',
  XS = 'XS',
}

export interface TextSizeConfig {
  value: number;
  unit: number;
  label: number;
  alarm: number;
}

export const sizeContent = {
  Huge: {
    value: 96,
    unit: 48,
    label: 48,
    alarm: 48,
  },
  XL: {
    value: 60,
    unit: 32,
    label: 32,
    alarm: 32,
  },
  L: {
    value: 48,
    unit: 24,
    label: 24,
    alarm: 24,
  },
  M: {
    value: 32,
    unit: 20,
    label: 20,
    alarm: 20,
  },
  S: {
    value: 24,
    unit: 16,
    label: 16,
    alarm: 16,
  },
  XS: {
    value: 20,
    unit: 14,
    label: 14,
    alarm: 14,
  },
};

/**
 * Number of characters in a string maps to a particular font size
 */
export const LengthToSize = {
  1: SizeFont.Huge,
  2: SizeFont.XL,
  3: SizeFont.XL,
  4: SizeFont.XL,
  5: SizeFont.XL,
  6: SizeFont.XL,
  7: SizeFont.L,
  8: SizeFont.L,
  9: SizeFont.M,
  10: SizeFont.M,
  11: SizeFont.M,
  12: SizeFont.S,
  13: SizeFont.S,
  14: SizeFont.XS,
};
