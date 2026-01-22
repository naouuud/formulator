export class InvalidDateError extends Error {}
export class InvalidRangeError extends Error {}

export enum PropType {
  LABEL = 'label',
  PLACEHOLDER = 'placeholder',
  MAXLENGTHCHAR = 'maxlengthchar',
  MAXLENGTHWORD = 'maxlengthword',
  REQUIRED = 'required',
  EMAIL = 'email',
  MAXVALUE = 'maxvalue',
  MINVALUE = 'minvalue',
  PATTERNPHONE = 'patternphone',
  PATTERNNUMBER = 'patternnumber',
  DATERANGE = 'daterange',
  OPTIONOTHER = 'optionother',
}

export const phonePattern = /^\d(?:\s?\d){7}$/;
export const numberPattern = /^[+-]?\d+(\.\d+)?$/;

// Dates
type DateString = string;
export type DateRange = { max: DateString; min: DateString };

function isDateString(value: string): value is DateString {
  if (value === 'today') return true; // DateString 'today' allows dynamic storage, interpreted at runtime
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

// function assertIsDateString(value: string): asserts value is DateString {
//   if (!isDateString(value)) {
//     throw new InvalidDateError(
//       'Invalid date provided, use format "YYYY-MM-DD" and ensure date is a valid calendar date.',
//     );
//   }
// }

// factory implements runtime check and throws error
export function createDateRange(max: string, min: string): DateRange {
  if (!isDateString(min) || !isDateString(max))
    throw new InvalidDateError(
      'Invalid date provided, use format "YYYY-MM-DD" and ensure date is a valid calendar date.',
    );
  const maxCheck = max === 'today' ? todayString() : max;
  const minCheck = min === 'today' ? todayString() : min;
  if (minCheck > maxCheck)
    throw new InvalidRangeError('Invalid date range, min cannot be larger than max.'); // ISO strings compare lexicographically
  return { max, min };
}

export function todayString(yearOffset: number = 0): DateString {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const todayString = `${year + yearOffset}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  return todayString;
}

export type PropValueMap = {
  [PropType.LABEL]: string;
  [PropType.PLACEHOLDER]: string;
  [PropType.MAXLENGTHCHAR]: number;
  [PropType.MAXLENGTHWORD]: number;
  [PropType.REQUIRED]: boolean;
  [PropType.EMAIL]: boolean;
  [PropType.MAXVALUE]: number;
  [PropType.MINVALUE]: number;
  [PropType.PATTERNPHONE]: boolean;
  [PropType.PATTERNNUMBER]: boolean;
  [PropType.DATERANGE]: DateRange;
  [PropType.OPTIONOTHER]: boolean;
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
