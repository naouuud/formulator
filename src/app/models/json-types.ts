import { leb_governorates } from './lebanon';

export enum Type {
  NAME = 'name',
  BIRTHDAY = 'birthday',
  GENDER = 'gender',
  PHONE = 'phone',
  EMAIL = 'email',
  ADDRESS = 'address',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

// export interface FormSectionI {
//   type: Type;
//   label: string;
//   required: boolean;
// }

interface OptionI {
  label: string;
  value: string;
}

export abstract class Field {
  abstract type: Type;
  fieldId = crypto.randomUUID();
  label: string = '';
  required: boolean = false;
}

export abstract class Group {
  abstract type: Type;
  label: string = '';
  required: boolean = false;
  fields: Field[] = [];
}

export class TextField extends Field {
  type: Type = Type.TEXT;
  maxLength: number = 100;
  minLength: number = 0;
  placeholder: string = '';
}

export class NumberField extends TextField {
  override type: Type = Type.NUMBER;
  // MAX and MIN number values, use custom validator
  maxValue: number = 1000000000; // one billion
  minValue: number = -1000000000; // negative one billion
  override placeholder: string = 'Enter number...';
  pattern: RegExp = /^[+-]?\d+(\.\d+)?$/;
}

export class PhoneField extends TextField {
  override type: Type = Type.PHONE;
  override maxLength: number = 15;
  override minLength: number = 8;
  override placeholder: string = 'Enter phone number...';
  override label: string = 'Phone Number';
  pattern: RegExp = /^\d(?:\s?\d){7}$/;
}

export class TextareaField extends TextField {
  override type: Type = Type.TEXTAREA;
  override maxLength: number = 500;
  override placeholder: string = 'Enter your text...';
}

export class RadioField extends Field {
  type: Type = Type.RADIO;
  options: OptionI[] = [];
  col: boolean = true;
}

export class BooleanField extends RadioField {
  override type: Type = Type.BOOLEAN;
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

export class GenderField extends RadioField {
  override type: Type = Type.GENDER;
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

// export class SentimentField extends RadioField {
//   override options: OptionI[] = [
//     {
//       label: 'Strongly Agree',
//       value: 'strongly-agree',
//     },
//     {
//       label: 'Agree',
//       value: 'agree',
//     },
//     {
//       label: 'Neutral',
//       value: 'neutral',
//     },
//     {
//       label: 'Disagree',
//       value: 'disagree',
//     },
//     {
//       label: 'Strongly Disagree',
//       value: 'strongly-disagree',
//     },
//   ];
//   override col: boolean = false;
// }

export class CheckBoxField extends Field {
  type: Type = Type.CHECKBOX;
  options: OptionI[] = [];
}

export class SelectField extends Field {
  type: Type = Type.SELECT;
  options: OptionI[] = [];
  placeholder: string = '';
}

export class DateField extends Field {
  type: Type = Type.DATE;
  maxDate: string = '';
  minDate: string = '';
  maxYearDisplayed: number;
  minYearDisplayed: number;

  constructor() {
    super();
    const year = new Date().getFullYear();
    this.maxYearDisplayed = year;
    this.minYearDisplayed = year - 100;
  }
}

export class BirthdayField extends DateField {
  override type: Type = Type.BIRTHDAY;

  constructor() {
    super();
    const date = new Date();
    this.minYearDisplayed = date.getFullYear() - 125;
  }
}

export class EmailField extends Field {
  type: Type = Type.EMAIL;
  maxLength: number = 50;
  minLength: number = 0;
  placeholder: string = 'Enter your email...';
  override label: string = 'Email';
}

export class NameGroup extends Group {
  override type: Type = Type.NAME;

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

export class AddressGroup extends Group {
  type: Type = Type.ADDRESS;
  override label: string = 'Address';
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

export type Section = Field | Group;

export class FormModel {
  formId: string = crypto.randomUUID();
  name: string = '';
  sections: Section[] = [];
  addSection(section: Section): void {
    this.sections.push(section);
  }
}
