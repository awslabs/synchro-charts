export interface DialSizeConfig {
  fontSize: number;
  dialThickness: number;
  iconSize: number;
  labelSize: number;
  unitSize: number;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type DialErrorMessages = {
  errorTimeLabel: string;
  dataNotNumberError: string;
};

export type DialMessages = {
  error: DialErrorMessages;
};
