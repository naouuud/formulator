import { leb_governorates } from './lebanon';

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  ADDRESS = 'address',
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

export class AddressField extends BaseField {
  type: FieldType = FieldType.ADDRESS;
  override label: string = 'Address';
  fields: FieldI[] = [];
  geoData = leb_governorates;

  constructor() {
    super();
    const governorateField = new SelectField();
    governorateField.label = 'Governorate';
    governorateField.placeholder = 'Select governorate';
    governorateField.options = this.geoData.map((g) => ({
      label: g.name,
      value: g.value,
    }));
    const districtField = new SelectField();
    districtField.label = 'District';
    districtField.placeholder = 'Select district';
    const streetField = new TextField();
    streetField.label = 'Street and Building';
    streetField.placeholder = 'Enter street and building name...';
    streetField.maxLength = 60;
    const cityField = new TextField();
    cityField.label = 'City';
    cityField.placeholder = 'Enter city...';
    cityField.maxLength = 20;
    this.fields.push(governorateField, districtField, streetField, cityField);
  }
}

export class FormModel {
  name: string = '';
  fields: FieldI[] = [];
}
