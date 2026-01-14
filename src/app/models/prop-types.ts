export enum PropType {
  LABEL = 'label',
  PLACEHOLDER = 'placeholder',
  MAXLENGTHCHAR = 'maxlengthchar',
  // MINLENGTHCHAR = 'minlengthchar',
  MAXLENGTHWORD = 'maxlengthword',
  // MINLENGTHWORD = 'minlengthword',
  REQUIRED = 'required',
  EMAIL = 'email',
  MAXVALUE = 'maxvalue',
  MINVALUE = 'minvalue',
  PATTERNPHONE = 'patternphone',
  PATTERNNUMBER = 'patternnumber',
  MAXDATE = 'maxdate',
  MINDATE = 'mindate',
  MAXYEARDISP = 'maxyeardisp',
  MINYEARDISP = 'minyeardisp',
}

export type PropValueMap = {
  [PropType.LABEL]: string;
  [PropType.PLACEHOLDER]: string;
  [PropType.MAXLENGTHCHAR]: number;
  // [PropType.MINLENGTHCHAR]: number;
  [PropType.MAXLENGTHWORD]: number;
  // [PropType.MINLENGTHWORD]: number;
  [PropType.REQUIRED]: boolean;
  [PropType.EMAIL]: boolean;
  [PropType.MAXVALUE]: number;
  [PropType.MINVALUE]: number;
  [PropType.PATTERNPHONE]: boolean;
  [PropType.PATTERNNUMBER]: boolean;
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
    editable: boolean;
  };
}[keyof PropValueMap];

export interface PropChangeEvent {
  propType: PropType;
  value: unknown;
}

export const phonePattern = /^\d(?:\s?\d){7}$/;
export const numberPattern = /^[+-]?\d+(\.\d+)?$/;
