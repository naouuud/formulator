import { leb_governorates } from './lebanon';
import { Field, FieldType } from './field-types';
import { PropType } from './prop-types';

type GroupFactory = () => Group;

export enum GroupType {
  NONE = 'none',
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

export class Group {
  groupType: GroupType = GroupType.NONE;
  groupId = crypto.randomUUID();
  fields: Field[] = [];

  toggleRadioCheckbox(): void {
    if (this.groupType === GroupType.RADIO) {
      this.groupType = GroupType.CHECKBOX;
      this.fields[0].fieldType = FieldType.CHECKBOX;
    } else if (this.groupType === GroupType.CHECKBOX) {
      this.groupType = GroupType.RADIO;
      this.fields[0].fieldType = FieldType.RADIO;
    }
  }

  addField(fieldType: FieldType) {
    const field = Field.create(fieldType);
    this.fields.push(field);
  }

  static create(groupType: GroupType): Group {
    const factory = groupMap.get(groupType);
    if (!factory) {
      throw new Error(
        `Internal Error: No factory registered for groupType '${groupType}'. Did you forget to add it to groupMap?`,
      );
    }
    return factory();
  }

  static deserialize(serializedModel: any): Group {
    const groupType = serializedModel.groupType;
    if (groupType == null) {
      // === undefined || === null
      throw new Error(`No groupType available on saved model, unable to initialize group`);
    }
    if (!Object.values(GroupType).includes(groupType)) {
      throw new Error(`Invalid groupType '${groupType}'`);
    }
    const group = Group.create(groupType); // create new group
    Object.assign(group, serializedModel); // copy enumerable properties
    group.fields = (serializedModel.fields ?? []).map((f: any) => Field.deserialize(f)); // initialize new fields
    return group;
  }
}

const groupMap = new Map<GroupType, GroupFactory>([
  [GroupType.TEXT, createTextGroup],
  [GroupType.TEXTAREA, createTextareaGroup],
  [GroupType.SELECT, createSelectGroup],
  [GroupType.CHECKBOX, createCheckboxGroup],
  [GroupType.RADIO, createRadioGroup],
  [GroupType.DATE, createDateGroup],
  [GroupType.NUMBER, createNumberGroup],
  [GroupType.BOOLEAN, createBooleanGroup],
  [GroupType.NAME, createNameGroup],
  [GroupType.ADDRESS, createAddressGroup],
  [GroupType.BIRTHDAY, createBirthdayGroup],
  [GroupType.GENDER, createGenderGroup],
  [GroupType.PHONE, createPhoneGroup],
  [GroupType.EMAIL, createEmailGroup],
]);

function createTextGroup() {
  const group = new Group();
  group.groupType = GroupType.TEXT;

  const field = Field.create(FieldType.TEXT);
  group.fields.push(field);
  return group;
}

function createEmailGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.EMAIL;

  const field = Field.create(FieldType.TEXT);
  field.setProp(PropType.EMAIL, true);
  field.setProp(PropType.MAXLENGTHCHAR, 50, false);
  // field.setProp(PropType.MINLENGTHCHAR, 0, false);
  field.setProp(PropType.LABEL, 'Email', false);
  field.setProp(PropType.PLACEHOLDER, 'Enter your email...');

  group.fields.push(field);
  return group;
}

function createNumberGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.NUMBER;

  const field = Field.create(FieldType.TEXT);
  field.setProp(PropType.PATTERNNUMBER, true);
  field.setProp(PropType.MAXLENGTHCHAR, 20, false);
  field.setProp(PropType.MAXVALUE, 1_000_000_000);
  field.setProp(PropType.MINVALUE, -1_000_000_000);
  field.setProp(PropType.PLACEHOLDER, 'Enter number...');

  group.fields.push(field);
  return group;
}

function createPhoneGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.PHONE;

  const field = Field.create(FieldType.TEXT);
  field.setProp(PropType.PATTERNPHONE, true);
  field.setProp(PropType.MAXLENGTHCHAR, 15, false);
  field.setProp(PropType.PLACEHOLDER, 'Enter phone number...');
  field.setProp(PropType.LABEL, 'Phone', false);

  group.fields.push(field);
  return group;
}

function createTextareaGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.TEXTAREA;

  const field = Field.create(FieldType.TEXTAREA);

  group.fields.push(field);
  return group;
}

function createRadioGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.RADIO;

  const field = Field.create(FieldType.RADIO);

  group.fields.push(field);
  return group;
}

function createBooleanGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.BOOLEAN;

  const field = Field.create(FieldType.RADIO);
  field.options = ['Yes', 'No', 'Unsure'];

  group.fields.push(field);
  return group;
}

function createGenderGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.GENDER;

  const field = Field.create(FieldType.RADIO);
  field.setProp(PropType.LABEL, 'Gender', false);
  field.options = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

  group.fields.push(field);
  return group;
}

function createCheckboxGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.CHECKBOX;

  const field = Field.create(FieldType.CHECKBOX);

  group.fields.push(field);
  return group;
}

function createSelectGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.SELECT;

  const field = Field.create(FieldType.SELECT);

  group.fields.push(field);
  return group;
}

function createDateGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.DATE;

  const field = Field.create(FieldType.DATE);
  group.fields.push(field);
  return group;
}

function createBirthdayGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.BIRTHDAY;

  const field = Field.create(FieldType.DATE);
  field.setProp(PropType.LABEL, 'Date of Birth', false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const maxDateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
  const minDateString = `${currentYear - 125}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
  field.setProp(PropType.DATERANGE, { max: maxDateString, min: minDateString }, false);

  group.fields.push(field);
  return group;
}

function createNameGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.NAME;

  const firstName = Field.create(FieldType.TEXT);
  firstName.setProp(PropType.LABEL, 'First Name', false);
  firstName.setProp(PropType.PLACEHOLDER, 'Enter first name...');
  firstName.setProp(PropType.REQUIRED, true);
  firstName.setProp(PropType.MAXLENGTHCHAR, 100, false);

  const lastName = Field.create(FieldType.TEXT);
  lastName.setProp(PropType.LABEL, 'Last Name', false);
  lastName.setProp(PropType.PLACEHOLDER, 'Enter last name...');
  lastName.setProp(PropType.REQUIRED, true);
  lastName.setProp(PropType.MAXLENGTHCHAR, 100, false);

  group.fields.push(firstName, lastName);
  return group;
}

function createAddressGroup(): Group {
  const group = new Group();
  group.groupType = GroupType.ADDRESS;

  const governorate = Field.create(FieldType.SELECT);
  governorate.setProp(PropType.LABEL, 'Governorate');
  governorate.setProp(PropType.PLACEHOLDER, 'Select governorate');
  governorate.options = leb_governorates.map((g) => g.name);

  const district = Field.create(FieldType.SELECT);
  district.setProp(PropType.LABEL, 'District');
  district.setProp(PropType.PLACEHOLDER, 'Select district');

  const street = Field.create(FieldType.TEXT);
  street.setProp(PropType.LABEL, 'Street and building', false);
  street.setProp(PropType.PLACEHOLDER, 'Enter street and building name...');
  street.setProp(PropType.MAXLENGTHCHAR, 100, false);

  const city = Field.create(FieldType.TEXT);
  city.setProp(PropType.LABEL, 'City', false);
  city.setProp(PropType.PLACEHOLDER, 'Enter city...');
  city.setProp(PropType.MAXLENGTHCHAR, 100, false);

  group.fields.push(governorate, district, street, city);
  return group;
}
