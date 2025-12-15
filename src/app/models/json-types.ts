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
  NAME = 'name',
  BIRTHDAY = 'birthday',
  PHONE = 'phone',
}

export interface FieldI {
  fieldId: string;
  fieldType: FieldType;
  label: string;
  required: boolean;
}

interface OptionI {
  label: string;
  value: string;
}

abstract class BaseField implements FieldI {
  fieldId = crypto.randomUUID();
  abstract fieldType: FieldType;
  label: string = '';
  required: boolean = false;
}

export class TextField extends BaseField {
  fieldType: FieldType = FieldType.TEXT;
  maxLength: number = 100;
  minLength: number = 0;
  placeholder: string = '';
}

export class NumberField extends TextField {
  override fieldType: FieldType = FieldType.NUMBER;
  maxValue: number = 100;
  minValue: number = 0;
  override placeholder: string = 'Enter number...';
}

export class PhoneField extends TextField {
  override fieldType: FieldType = FieldType.PHONE;
  override maxLength: number = 8;
  override placeholder: string = 'Enter phone number...';
  override label: string = 'Phone Number';
  pattern: RegExp = /^d(?:s?d){7}$/;
}

export class TextareaField extends TextField {
  override fieldType: FieldType = FieldType.TEXTAREA;
  override maxLength: number = 500;
  override placeholder: string = 'Enter your text...';
}

export class RadioField extends BaseField {
  fieldType: FieldType = FieldType.RADIO;
  options: OptionI[] = [];
  col: boolean = true;
}

// custom RadioField, no special rendering
export class BooleanField extends RadioField {
  private unsureOption: boolean = false;
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

  includeUnsure(val: boolean) {
    if (val === this.unsureOption) return;
    if (val) {
      this.unsureOption = true;
      this.options.push({
        label: 'Unsure',
        value: 'unsure',
      });
    } else {
      this.unsureOption = false;
      this.options.splice(2, 1);
    }
  }
}

// custom RadioField, no special rendering
export class GenderField extends RadioField {
  private nonbinaryOption: boolean = false;
  override options: OptionI[] = [
    { label: 'Female', value: 'f' },
    {
      label: 'Male',
      value: 'm',
    },
  ];
  override col: boolean = false;

  includeNonBinary(val: boolean) {
    if (val === this.nonbinaryOption) return;
    if (val) {
      this.nonbinaryOption = true;
      this.options.push({
        label: 'Non-binary',
        value: 'n',
      });
    } else {
      this.nonbinaryOption = false;
      this.options.splice(2, 1);
    }
  }
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
  fieldType: FieldType = FieldType.CHECKBOX;
  options: OptionI[] = [];
}

export class SelectField extends BaseField {
  fieldType: FieldType = FieldType.SELECT;
  options: OptionI[] = [];
  placeholder: string = '';
}

export class DateField extends BaseField {
  fieldType: FieldType = FieldType.DATE;
  maxYear: number;
  minYear: number;

  constructor() {
    super();
    const year = new Date().getFullYear();
    this.maxYear = year;
    this.minYear = year - 100;
  }
}

export class BirthdayField extends DateField {
  override fieldType: FieldType = FieldType.BIRTHDAY;

  constructor() {
    super();
    this.minYear = new Date().getFullYear() - 125;
  }
}

export class EmailField extends BaseField {
  fieldType: FieldType = FieldType.EMAIL;
  maxLength: number = 50;
  minLength: number = 0;
  placeholder: string = 'Enter your email...';
  override label: string = 'Email';
}

export class NameGroup extends BaseField {
  override fieldType: FieldType = FieldType.NAME;
  fields: FieldI[] = [];

  constructor() {
    super();
    const firstNameField = new TextField();
    firstNameField.label = 'First Name';
    firstNameField.placeholder = 'Enter first name...';
    const lastNameField = new TextField();
    lastNameField.label = 'Last Name';
    lastNameField.placeholder = 'Enter last name...';
    this.fields.push(firstNameField, lastNameField);
  }
}

export class AddressGroup extends BaseField {
  fieldType: FieldType = FieldType.ADDRESS;
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
