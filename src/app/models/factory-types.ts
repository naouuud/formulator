import { leb_governorates } from './lebanon';
import { Node, NodeFactory, NodeType } from './node-types';
import { createDateRange, PropType, todayString } from './prop-types';

export enum FactoryType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  GROUP = 'group',
  EMAIL = 'email',
  PHONE = 'phone',
  GENDER = 'gender',
  BIRTHDAY = 'birthday',
  BOOLEAN = 'boolean',
  NAME = 'name',
  ADDRESS = 'address',
}

export type FactoryIcon = {
  factoryType: FactoryType;
  label: string;
  description?: string;
  img: string;
  attribution: string;
};

export const factoryIconsBasic: FactoryIcon[] = [
  {
    factoryType: FactoryType.TEXT,
    label: 'Short Text',
    description: 'Maximum length 100 characters.',
    img: 'font.png',
    attribution: 'Freepik',
  },
  {
    factoryType: FactoryType.TEXTAREA,
    label: 'Long Text',
    description:
      'Ideal for comments, descriptions and essays. Set a word limit to keep answers concise.',
    img: 'comment.png',
    attribution: 'Freepik',
  },
  {
    factoryType: FactoryType.NUMBER,
    label: 'Number',
    img: 'pin.png',
    attribution: 'Fathema Khanom',
  },
  {
    factoryType: FactoryType.DATE,
    label: 'Date',
    img: 'calendar.png',
    attribution: 'Freepik',
  },
  {
    factoryType: FactoryType.EMAIL,
    label: 'Email',
    img: 'email.png',
    attribution: 'Those Icons',
  },
  {
    factoryType: FactoryType.PHONE,
    label: 'Phone',
    description: '',
    img: 'smartphone-call.png',
    attribution: 'Freepik',
  },
  {
    factoryType: FactoryType.SELECT,
    label: 'Dropdown',
    description: 'Select an option.',
    img: 'dropdown.png',
    attribution: 'Royyan Wijaya',
  },
  {
    factoryType: FactoryType.CHECKBOX,
    label: 'Checkbox',
    description: 'Check all that apply.',
    img: 'check.png',
    attribution: 'Picons',
  },
  {
    factoryType: FactoryType.RADIO,
    label: 'Radio',
    description: 'Check one option only.',
    img: 'radio.png',
    attribution: 'Bharat Icons',
  },
  {
    factoryType: FactoryType.GROUP,
    label: 'Make a Group',
    description: 'Group several questions together',
    img: 'drop-down-menu4.png',
    attribution: '',
  },
];

export const factoryIconsGroup: FactoryIcon[] = [
  {
    factoryType: FactoryType.GROUP,
    label: 'Group',
    description: 'Group several questions together.',
    img: 'drop-down-menu.png',
    attribution: '',
  },
];

export const factoryIconsComplex: FactoryIcon[] = [
  {
    factoryType: FactoryType.NAME,
    label: 'Name',
    img: 'user.png',
    attribution: 'Bharat Icons',
  },
  {
    factoryType: FactoryType.BIRTHDAY,
    label: 'Date of Birth',
    img: 'date-of-birth.png',
    attribution: 'Freepik',
  },
  {
    factoryType: FactoryType.GENDER,
    label: 'Gender',
    img: 'gender-fluid.png',
    attribution: 'Aranagraphics',
  },
  {
    factoryType: FactoryType.ADDRESS,
    label: 'Address',
    img: 'house.png',
    attribution: 'KP Arts',
  },
  {
    factoryType: FactoryType.BOOLEAN,
    label: 'Yes/No',
    img: 'yes.png',
    attribution: 'Freepik',
  },
];

export const factoryMap = new Map<FactoryType, NodeFactory>([
  [FactoryType.TEXT, () => Node.create(NodeType.TEXT)],
  [FactoryType.TEXTAREA, () => Node.create(NodeType.TEXTAREA)],
  [FactoryType.NUMBER, () => Node.create(NodeType.NUMBER)],
  [FactoryType.SELECT, () => Node.create(NodeType.SELECT)],
  [FactoryType.CHECKBOX, () => Node.create(NodeType.CHECKBOX)],
  [FactoryType.RADIO, () => Node.create(NodeType.RADIO)],
  [FactoryType.DATE, () => Node.create(NodeType.DATE)],
  [FactoryType.EMAIL, () => Node.create(NodeType.EMAIL)],
  [FactoryType.PHONE, () => Node.create(NodeType.PHONE)],
  [FactoryType.GROUP, () => Node.create(NodeType.GROUP)],
  [FactoryType.NAME, createNameGroup],
  [FactoryType.ADDRESS, createAddressGroup],
  [FactoryType.GENDER, createGenderQuestion],
  [FactoryType.BOOLEAN, createYesNoQuestion],
  [FactoryType.BIRTHDAY, createBirthdayQuestion],
]);

// GROUP FACTORIES
export function createNameGroup(): Node {
  const group = Node.create(NodeType.GROUP);
  group.setProp(PropType.LABEL, 'Name');

  const firstName = Node.create(NodeType.TEXT);
  firstName.setProp(PropType.LABEL, 'First Name');
  firstName.setProp(PropType.PLACEHOLDER, 'Enter first name...');
  firstName.setProp(PropType.REQUIRED, true);
  firstName.setProp(PropType.MAXLENGTHCHAR, 100, false);

  const lastName = Node.create(NodeType.TEXT);
  lastName.setProp(PropType.LABEL, 'Last Name');
  lastName.setProp(PropType.PLACEHOLDER, 'Enter last name...');
  lastName.setProp(PropType.REQUIRED, true);
  lastName.setProp(PropType.MAXLENGTHCHAR, 100, false);

  group.addNodes(firstName, lastName);
  return group;
}

function createAddressGroup(): Node {
  const group = Node.create(NodeType.GROUP);
  group.setProp(PropType.LABEL, 'Address');

  const governorate = Node.create(NodeType.SELECT);
  governorate.setProp(PropType.LABEL, 'Governorate');
  governorate.setProp(
    PropType.OPTIONS,
    leb_governorates.map((g) => g.name),
  );

  const district = Node.create(NodeType.SELECT);
  district.setProp(PropType.LABEL, 'District');
  district.setProp(PropType.PLACEHOLDER, 'Select district');

  const street = Node.create(NodeType.TEXT);
  street.setProp(PropType.LABEL, 'Street and building', false);
  street.setProp(PropType.PLACEHOLDER, 'Enter street and building name...');
  street.setProp(PropType.MAXLENGTHCHAR, 100, false);

  const city = Node.create(NodeType.TEXT);
  city.setProp(PropType.LABEL, 'City', false);
  city.setProp(PropType.PLACEHOLDER, 'Enter city...');
  city.setProp(PropType.MAXLENGTHCHAR, 100, false);

  group.addNodes(governorate, district, street, city);
  return group;
}

function createGenderQuestion(): Node {
  const node = Node.create(NodeType.RADIO);
  node.setProp(PropType.LABEL, 'Gender', false);
  node.setProp(PropType.OPTIONS, ['Female', 'Male', 'Non-binary', 'Prefer not to say']);
  node.setProp(PropType.ALLOWTOGGLE, false);
  return node;
}

function createBirthdayQuestion(): Node {
  const node = Node.create(NodeType.DATE);
  node.setProp(PropType.LABEL, 'Date of birth', false);
  const maxDateString = 'today';
  const minDateString = todayString(-120);
  const dateRange = createDateRange(maxDateString, minDateString); // use factory
  node.setProp(PropType.DATERANGE, dateRange, false);
  return node;
}

function createYesNoQuestion(): Node {
  const node = Node.create(NodeType.RADIO);
  node.setProp(PropType.OPTIONS, ['Yes', 'No', 'Unsure']);
  node.setProp(PropType.ALLOWTOGGLE, false);
  node.deleteProp(PropType.OPTIONOTHER);
  return node;
}
