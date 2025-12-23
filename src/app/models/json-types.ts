import { leb_governorates } from './lebanon';

export enum FieldType {
  BIRTHDAY = 'birthday',
  GENDER = 'gender',
  PHONE = 'phone',
  EMAIL = 'email',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

export enum GroupType {
  BIRTHDAY = 'birthday',
  GENDER = 'gender',
  PHONE = 'phone',
  EMAIL = 'email',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  NAME = 'name',
  ADDRESS = 'address',
}

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

type PropValueMap = {
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

// produces type dynamically using PropValueMap (same as above)
export type Prop = {
  [K in keyof PropValueMap]: {
    propType: K;
    value: PropValueMap[K];
  };
}[keyof PropValueMap];

export abstract class Field {
  abstract fieldType: FieldType;
  fieldId = crypto.randomUUID();
  props: Prop[] = [];

  constructor() {
    this.addProp(PropType.LABEL, '');
    this.addProp(PropType.REQUIRED, false);
  }

  // 'squeeze' function to enforce type correctness during construction
  private _createProp<K extends PropType>(
    propType: K,
    value: PropValueMap[K]
  ): Extract<Prop, { propType: K }> {
    return { propType, value } as Extract<Prop, { propType: K }>;
  }

  getProp<K extends PropType>(propTypeIn: K): Extract<Prop, { propType: K }> | undefined {
    const prop = this.props.find((p) => p.propType === propTypeIn);
    if (prop) return prop as Extract<Prop, { propType: K }>;
    return;
  }

  getPropValue<K extends PropType>(propTypeIn: K): PropValueMap[K] | null {
    const prop = this.getProp(propTypeIn);
    if (prop) {
      return prop.value as PropValueMap[K];
    }
    return null;
  }

  addProp<K extends PropType>(propTypeIn: K, valueIn: PropValueMap[K]) {
    const existing = this.getProp(propTypeIn);
    if (existing) {
      existing.value = valueIn;
      return;
    }
    this.props.push(this._createProp(propTypeIn, valueIn));
  }
}

export class TextField extends Field {
  fieldType: FieldType = FieldType.TEXT;

  constructor() {
    super();
    this.addProp(PropType.MAXLENGTH, 100);
    this.addProp(PropType.MINLENGTH, 0);
    this.addProp(PropType.PLACEHOLDER, '');
  }
}

export class NumberField extends TextField {
  override fieldType: FieldType = FieldType.NUMBER;

  constructor() {
    super();
    this.addProp(PropType.MAXVALUE, 1000000000);
    this.addProp(PropType.MINVALUE, -1000000000);
    this.addProp(PropType.PLACEHOLDER, 'Enter number...');
    this.addProp(PropType.PATTERN, /^[+-]?\d+(\.\d+)?$/);
  }
}

export class EmailField extends TextField {
  override fieldType: FieldType = FieldType.EMAIL;

  constructor() {
    super();
    this.addProp(PropType.EMAIL, true);
    this.addProp(PropType.MAXLENGTH, 50);
    this.addProp(PropType.LABEL, 'Email');
    this.addProp(PropType.PLACEHOLDER, 'Enter your email...');
  }
}

export class TextareaField extends TextField {
  override fieldType: FieldType = FieldType.TEXTAREA;

  constructor() {
    super();
    this.addProp(PropType.MAXLENGTH, 500);
    this.addProp(PropType.PLACEHOLDER, 'Enter your text...');
  }
}

export class PhoneField extends Field {
  fieldType: FieldType = FieldType.PHONE;

  constructor() {
    super();
    this.addProp(PropType.MAXLENGTH, 15);
    this.addProp(PropType.MINLENGTH, 8);
    this.addProp(PropType.PLACEHOLDER, 'Enter phone number...');
    this.addProp(PropType.LABEL, 'Phone Number');
    this.addProp(PropType.PATTERN, /^\d(?:\s?\d){7}$/);
  }
}

interface OptionI {
  label: string;
  value: string;
}

export class RadioField extends Field {
  fieldType: FieldType = FieldType.RADIO;
  options: OptionI[] = [];
  col: boolean = true;
}

export class BooleanField extends RadioField {
  override fieldType: FieldType = FieldType.BOOLEAN;
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
  override fieldType: FieldType = FieldType.GENDER;
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
  fieldType: FieldType = FieldType.CHECKBOX;
  options: OptionI[] = [];
}

export class SelectField extends Field {
  fieldType: FieldType = FieldType.SELECT;
  options: OptionI[] = [];
  placeholder: string = '';
}

export class DateField extends Field {
  fieldType: FieldType = FieldType.DATE;

  constructor() {
    super();
    const year = new Date().getFullYear();
    this.addProp(PropType.MINYEARDISP, year - 100);
    this.addProp(PropType.MAXYEARDISP, year);
    this.addProp(PropType.MINDATE, '');
    this.addProp(PropType.MAXDATE, '');
  }
}

export class BirthdayField extends DateField {
  override fieldType: FieldType = FieldType.BIRTHDAY;

  constructor() {
    super();
    const date = new Date();
    const year = date.getFullYear();
    this.addProp(PropType.MINYEARDISP, year - 125);
    this.addProp(PropType.MINDATE, `${year - 125}-01-01`);
    this.addProp(PropType.MAXDATE, `${year}-${date.getMonth() + 1}-${date.getDate()}`);
  }
}

export class FormModel {
  formId: string = crypto.randomUUID();
  formName: string = '';
  groups: Group[] = [];
  addGroup(...group: Group[]): void {
    this.groups.push(...group);
  }
}

export abstract class Group {
  abstract groupType: GroupType;
  groupLabel: string | null = null;
  groupRequired: boolean = false;
  fields: Field[] = [];

  addField(...field: Field[]) {
    this.fields.push(...field);
  }
}

export class TextGroup extends Group {
  override groupType: GroupType = GroupType.TEXT;
  constructor() {
    super();
    this.addField(new TextField());
  }
}

export class NumberGroup extends Group {
  override groupType: GroupType = GroupType.NUMBER;
  constructor() {
    super();
    this.addField(new NumberField());
  }
}

export class EmailGroup extends Group {
  override groupType: GroupType = GroupType.EMAIL;
  constructor() {
    super();
    this.addField(new EmailField());
  }
}

export class PhoneGroup extends Group {
  override groupType: GroupType = GroupType.PHONE;
  constructor() {
    super();
    this.addField(new PhoneField());
  }
}

export class TextareaGroup extends Group {
  override groupType: GroupType = GroupType.TEXTAREA;
  constructor() {
    super();
    this.addField(new TextareaField());
  }
}

export class RadioGroup extends Group {
  override groupType: GroupType = GroupType.RADIO;
  constructor() {
    super();
    this.addField(new RadioField());
  }
}

export class CheckboxGroup extends Group {
  override groupType: GroupType = GroupType.CHECKBOX;
  constructor() {
    super();
    this.addField(new CheckBoxField());
  }
}

export class SelectGroup extends Group {
  override groupType: GroupType = GroupType.SELECT;
  constructor() {
    super();
    this.addField(new SelectField());
  }
}

export class BooleanGroup extends Group {
  override groupType: GroupType = GroupType.BOOLEAN;
  constructor() {
    super();
    this.addField(new BooleanField());
  }
}

export class GenderGroup extends Group {
  override groupType: GroupType = GroupType.GENDER;
  override groupLabel: string | null = 'Gender';
  constructor() {
    super();
    this.addField(new GenderField());
  }
}

export class DateGroup extends Group {
  override groupType: GroupType = GroupType.DATE;
  constructor() {
    super();
    this.addField(new DateField());
  }
}

export class BirthdayGroup extends Group {
  override groupType: GroupType = GroupType.BIRTHDAY;
  override groupLabel: string | null = 'Date of Birth';
  constructor() {
    super();
    this.addField(new BirthdayField());
  }
}

export class NameGroup extends Group {
  override groupType: GroupType = GroupType.NAME;
  constructor() {
    super();
    const firstNameField = new TextField();
    firstNameField.addProp(PropType.LABEL, 'First Name');
    firstNameField.addProp(PropType.PLACEHOLDER, 'Enter first name...');
    const lastNameField = new TextField();
    lastNameField.addProp(PropType.LABEL, 'Last Name');
    lastNameField.addProp(PropType.PLACEHOLDER, 'Add last name...');
    this.addField(firstNameField, lastNameField);
  }
}

export class AddressGroup extends Group {
  override groupType: GroupType = GroupType.ADDRESS;
  override groupLabel: string = 'Address';
  geoData = leb_governorates;

  constructor() {
    super();
    const governorateField = new SelectField();
    governorateField.addProp(PropType.LABEL, 'Governorate');
    governorateField.addProp(PropType.PLACEHOLDER, 'Select governorate');
    governorateField.options = this.geoData.map((g) => ({
      label: g.name,
      value: g.value,
    }));
    const districtField = new SelectField();
    districtField.addProp(PropType.LABEL, 'District');
    districtField.addProp(PropType.PLACEHOLDER, 'Select district');
    const streetField = new TextField();
    streetField.addProp(PropType.LABEL, 'Street and Building');
    streetField.addProp(PropType.PLACEHOLDER, 'Enter street and building name...');
    const cityField = new TextField();
    cityField.addProp(PropType.LABEL, 'City');
    cityField.addProp(PropType.PLACEHOLDER, 'Enter city...');
    this.addField(governorateField, districtField, streetField, cityField);
  }
}
