export enum FieldType {
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
  fieldId: string;
  type: FieldType;
  label: string;
  required: boolean;
}

interface OptionI {
  label: string;
  value: string;
}

abstract class BaseField implements FieldI {
  fieldId = crypto.randomUUID();
  abstract type: FieldType;
  label: string = '';
  required: boolean = false;
}

export class TextField extends BaseField {
  type: FieldType = FieldType.TEXT;
  maxLength: number = 100;
  minLength: number = 0;
  placeholder: string = '';
}

export class NumberField extends TextField {
  override type: FieldType = FieldType.NUMBER;
  maxValue: number = 100;
  minValue: number = 0;
  override placeholder: string = 'Enter number...';
}

export class TextareaField extends TextField {
  override type: FieldType = FieldType.TEXTAREA;
  override maxLength: number = 500;
  override placeholder: string = 'Enter your text...';
}

export class RadioField extends BaseField {
  type: FieldType = FieldType.RADIO;
  options: OptionI[] = [];
  col: boolean = true;
}

export class BooleanField extends RadioField {
  override options: OptionI[] = [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ];
}

export class SentimentField extends RadioField {
  override options: OptionI[] = [
    {
      label: 'Strongly Agree',
      value: 'strongly-agree',
    },
    {
      label: 'Agree',
      value: 'agree',
    },
    {
      label: 'Neutral',
      value: 'neutral',
    },
    {
      label: 'Disagree',
      value: 'disagree',
    },
    {
      label: 'Strongly Disagree',
      value: 'strongly-disagree',
    },
  ];
  override col: boolean = false;
}

export class CheckBoxField extends BaseField {
  type: FieldType = FieldType.CHECKBOX;
  options: OptionI[] = [];
}

export class SelectField extends BaseField {
  type: FieldType = FieldType.SELECT;
  options: OptionI[] = [];
  placeholder: string = '';
}

export class DateField extends BaseField {
  type: FieldType = FieldType.DATE;
  maxYear: number = new Date().getFullYear();
  minYear: number = new Date().getFullYear() - 100;
}

export class EmailField extends BaseField {
  type: FieldType = FieldType.EMAIL;
  maxLength: number = 50;
  minLength: number = 0;
  placeholder: string = 'Enter your email...';
  override label: string = 'Email';
}

export class FormModel {
  name: string = '';
  fields: FieldI[] = [];
}
