export enum PropType {
  LABEL = 'label',
  PLACEHOLDER = 'placeholder',
  MAXLENGTH = 'maxlength',
  MINLENGTH = 'minlength',
  REQUIRED = 'required',
  EMAIL = 'email',
  MAXVALUE = 'maxvalue',
  MINVALUE = 'minvalue',
  PATTERN = 'pattern',
  MAXDATE = 'maxdate',
  MINDATE = 'mindate',
  MAXYEARDISP = 'maxyeardisp',
  MINYEARDISP = 'minyeardisp',
}

export type PropValueMap = {
  [PropType.LABEL]: string;
  [PropType.PLACEHOLDER]: string;
  [PropType.MAXLENGTH]: number;
  [PropType.MINLENGTH]: number;
  [PropType.REQUIRED]: boolean;
  [PropType.EMAIL]: boolean;
  [PropType.MAXVALUE]: number;
  [PropType.MINVALUE]: number;
  [PropType.PATTERN]: RegExp;
  [PropType.MAXDATE]: string;
  [PropType.MINDATE]: string;
  [PropType.MAXYEARDISP]: number;
  [PropType.MINYEARDISP]: number;
};

// produces type dynamically using PropValueMap (same as below)
export type Prop = {
  [K in keyof PropValueMap]: {
    propType: K;
    value: PropValueMap[K];
  };
}[keyof PropValueMap];

// export type Prop =
//   | { propType: PropType.LABEL; value: string }
//   | { propType: PropType.PLACEHOLDER; value: string }
//   | { propType: PropType.MAXLENGTH; value: number }
//   | { propType: PropType.MINLENGTH; value: number }
//   | { propType: PropType.REQUIRED; value: boolean }
//   | { propType: PropType.MAXVALUE; value: number }
//   | { propType: PropType.MINVALUE; value: number }
//   | { propType: PropType.PATTERN; value: RegExp }
//   | { propType: PropType.MAXDATE; value: string }
//   | { propType: PropType.MINDATE; value: string }
//   | { propType: PropType.MAXYEARDISP; value: number }
//   | { propType: PropType.MINYEARDISP; value: number }
//   | { propType: PropType.EMAIL; value: boolean };

export interface PropChangeEvent {
  propType: PropType;
  value: unknown;
}
