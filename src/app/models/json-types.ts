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

export class Text extends BaseField {
  type: HTMLType = HTMLType.TEXT;
  maxLength: number = 100;
  minLength: number = 0;
  placeholder: string = '';
}

export class Radio extends BaseField {
  type: HTMLType = HTMLType.RADIO;
  options: OptionI[] = [];
}

export type FormModel = FieldI[];
