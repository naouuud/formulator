export enum HTMLType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
}

export interface FieldI {
  id: string;
  type: HTMLType;
  label: string;
  required: boolean;
}

interface OptionI {
  value: string;
  label: string;
}

abstract class BaseField implements FieldI {
  id = crypto.randomUUID();
  abstract type: HTMLType;
  label: string = '';
  required: boolean = false;
}

export class TextField extends BaseField {
  type: HTMLType = HTMLType.TEXT;
  maxLength: number = 100;
  minLength: number = 0;
  placeholder: string = '';
}

export class RadioField extends BaseField {
  type: HTMLType = HTMLType.RADIO;
  options: OptionI[] = [];
}

export class CheckBoxField extends BaseField {
  type: HTMLType = HTMLType.CHECKBOX;
  options: OptionI[] = [];
}

export class SelectField extends BaseField {
  type: HTMLType = HTMLType.SELECT;
  options: OptionI[] = [];
  placeholder: string = '';
}

export class DateField extends BaseField {
  type: HTMLType = HTMLType.DATE;
  maxYear: number = new Date().getFullYear();
  minYear: number = new Date().getFullYear() - 100;
}

export type FormModel = FieldI[];
