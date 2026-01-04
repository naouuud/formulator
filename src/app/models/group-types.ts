import { leb_governorates } from './lebanon';
import {
  CheckBoxField,
  DateField,
  Field,
  FieldType,
  RadioField,
  SelectField,
  TextareaField,
  TextField,
} from './field-types';
import { PropType } from './prop-types';

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

export const groupMap = new Map<GroupType, () => Group>([
  [GroupType.TEXT, () => new TextGroup()],
  [GroupType.TEXTAREA, () => new TextareaGroup()],
  [GroupType.SELECT, () => new SelectGroup()],
  [GroupType.CHECKBOX, () => new CheckboxGroup()],
  [GroupType.RADIO, () => new RadioGroup()],
  [GroupType.DATE, () => new DateGroup()],
  [GroupType.NUMBER, () => new NumberGroup()],
  [GroupType.BOOLEAN, () => new BooleanGroup()],
  [GroupType.NAME, () => new NameGroup()],
  [GroupType.ADDRESS, () => new AddressGroup()],
  [GroupType.BIRTHDAY, () => new BirthdayGroup()],
  [GroupType.GENDER, () => new GenderGroup()],
  [GroupType.PHONE, () => new PhoneGroup()],
  [GroupType.EMAIL, () => new EmailGroup()],
]);

export abstract class Group {
  abstract groupType: GroupType;
  groupId = crypto.randomUUID();
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

export class EmailGroup extends TextGroup {
  override groupType: GroupType = GroupType.EMAIL;
  constructor() {
    super();
    const field = this.fields[0];
    field.setProp(PropType.EMAIL, true);
    field.setProp(PropType.MAXLENGTH, 50);
    field.setProp(PropType.LABEL, 'Email');
    field.setProp(PropType.PLACEHOLDER, 'Enter your email...');
  }
}

export class NumberGroup extends TextGroup {
  override groupType: GroupType = GroupType.NUMBER;
  constructor() {
    super();
    const field = this.fields[0];
    field.setProp(PropType.MAXVALUE, 1000000000);
    field.setProp(PropType.MINVALUE, -1000000000);
    field.setProp(PropType.PLACEHOLDER, 'Enter number...');
    field.setProp(PropType.PATTERN, /^[+-]?\d+(\.\d+)?$/);
  }
}

export class PhoneGroup extends TextGroup {
  override groupType: GroupType = GroupType.PHONE;
  constructor() {
    super();
    const field = this.fields[0];
    field.setProp(PropType.MAXLENGTH, 15);
    field.setProp(PropType.MINLENGTH, 8);
    field.setProp(PropType.PLACEHOLDER, 'Enter phone number...');
    field.setProp(PropType.LABEL, 'Phone');
    field.setProp(PropType.PATTERN, /^\d(?:\s?\d){7}$/);
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

export class BooleanGroup extends RadioGroup {
  override groupType: GroupType = GroupType.BOOLEAN;
  private unsureOption: boolean = false;

  constructor() {
    super();
    const field = this.fields[0];
    if (field.fieldType !== FieldType.RADIO) return;
    field.options = [
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
}

export class GenderGroup extends RadioGroup {
  override groupType: GroupType = GroupType.GENDER;
  override groupLabel: string | null = 'Gender';

  constructor() {
    super();
    const field = this.fields[0];
    field.options = [
      { label: 'Female', value: 'f' },
      {
        label: 'Male',
        value: 'm',
      },
    ];
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

export class DateGroup extends Group {
  override groupType: GroupType = GroupType.DATE;
  constructor() {
    super();
    this.addField(new DateField());
  }
}

export class BirthdayGroup extends DateGroup {
  override groupType: GroupType = GroupType.BIRTHDAY;
  override groupLabel: string | null = 'Date of Birth';
  constructor() {
    super();
    const date = new Date();
    const year = date.getFullYear();
    this.fields[0].setProp(PropType.MINYEARDISP, year - 125);
    this.fields[0].setProp(PropType.MINDATE, `${year - 125}-01-01`);
    this.fields[0].setProp(PropType.MAXDATE, `${year}-${date.getMonth() + 1}-${date.getDate()}`);
  }
}

export class NameGroup extends Group {
  override groupType: GroupType = GroupType.NAME;
  constructor() {
    super();
    const firstNameField = new TextField();
    firstNameField.setProp(PropType.LABEL, 'First Name');
    firstNameField.setProp(PropType.PLACEHOLDER, 'Enter first name...');
    const lastNameField = new TextField();
    lastNameField.setProp(PropType.LABEL, 'Last Name');
    lastNameField.setProp(PropType.PLACEHOLDER, 'Add last name...');
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
    governorateField.setProp(PropType.LABEL, 'Governorate');
    governorateField.setProp(PropType.PLACEHOLDER, 'Select governorate');
    governorateField.options = this.geoData.map((g) => ({
      label: g.name,
      value: g.value,
    }));
    const districtField = new SelectField();
    districtField.setProp(PropType.LABEL, 'District');
    districtField.setProp(PropType.PLACEHOLDER, 'Select district');
    const streetField = new TextField();
    streetField.setProp(PropType.LABEL, 'Street and Building');
    streetField.setProp(PropType.PLACEHOLDER, 'Enter street and building name...');
    const cityField = new TextField();
    cityField.setProp(PropType.LABEL, 'City');
    cityField.setProp(PropType.PLACEHOLDER, 'Enter city...');
    this.addField(governorateField, districtField, streetField, cityField);
  }
}
