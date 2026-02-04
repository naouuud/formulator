import { Node, NodeType } from './node-types';
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
    factoryType: FactoryType.PHONE,
    label: 'Phone',
    description: '',
    img: 'smartphone-call.png',
    attribution: 'Freepik',
  },
  {
    factoryType: FactoryType.EMAIL,
    label: 'Email',
    img: 'email.png',
    attribution: 'Those Icons',
  },
  {
    factoryType: FactoryType.DATE,
    label: 'Date',
    img: 'calendar.png',
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

type Factory = () => Node[];
export const factoryMap = new Map<FactoryType, Factory>([
  [FactoryType.TEXT, createTextNode],
  [FactoryType.TEXTAREA, createTextareaNode],
  [FactoryType.NUMBER, createNumberNode],
  [FactoryType.SELECT, createSelectNode],
  [FactoryType.CHECKBOX, createCheckboxNode],
  [FactoryType.RADIO, createRadioNode],
  [FactoryType.DATE, createDateNode],
  [FactoryType.GROUP, createGroupNode],
  [FactoryType.EMAIL, createEmailNode],
  [FactoryType.PHONE, createPhoneNode],
  [FactoryType.NAME, createName],
  [FactoryType.ADDRESS, createAddress],
  [FactoryType.GENDER, createGender],
  [FactoryType.BOOLEAN, createBoolean],
  [FactoryType.BIRTHDAY, createBirthday],
]);

// SIMPLE
function createTextNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.TEXT;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.MAXLENGTHCHAR, 100);
  node.setProp(PropType.PLACEHOLDER, 'Enter response here...');
  return [node];
}

function createTextareaNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.TEXTAREA;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.MAXLENGTHWORD, 500);
  node.setProp(PropType.PLACEHOLDER, 'Enter response here...');
  return [node];
}

function createNumberNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.NUMBER;
  node.setProp(PropType.LABEL, '', true);
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.PATTERNNUMBER, true);
  node.setProp(PropType.MAXLENGTHCHAR, 20, false);
  // node.setProp(PropType.MAXVALUE, 1_000_000_000);
  // node.setProp(PropType.MINVALUE, -1_000_000_000);
  node.setProp(PropType.PLACEHOLDER, 'Enter number...');
  return [node];
}

function createSelectNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.SELECT;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.OPTIONS, []);
  return [node];
}

function createRadioNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.RADIO;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.OPTIONOTHER, false);
  node.setProp(PropType.OPTIONS, []);
  return [node];
}

function createCheckboxNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.CHECKBOX;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.OPTIONOTHER, false);
  node.setProp(PropType.OPTIONS, []);
  return [node];
}

function createDateNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.DATE;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  const maxDateString = todayString();
  const minDateString = todayString(-100);
  const dateRange = createDateRange(maxDateString, minDateString); // use factory
  node.setProp(PropType.DATERANGE, dateRange);
  return [node];
}

function createGroupNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.GROUP;
  node.setProp(PropType.LABEL, 'Group Label');
  return [node];
}

function createEmailNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.EMAIL;
  node.setProp(PropType.EMAIL, true);
  node.setProp(PropType.MAXLENGTHCHAR, 50, false);
  // node.setProp(PropType.MINLENGTHCHAR, 0, false);
  node.setProp(PropType.LABEL, 'Email');
  node.setProp(PropType.PLACEHOLDER, 'Enter your email...');
  return [node];
}

function createPhoneNode(): Node[] {
  const node = new Node();
  node.nodeType = NodeType.PHONE;
  node.setProp(PropType.PATTERNPHONE, true);
  node.setProp(PropType.MAXLENGTHCHAR, 15, false);
  node.setProp(PropType.PLACEHOLDER, 'Enter phone number...');
  node.setProp(PropType.LABEL, 'Phone number');
  return [node];
}

// COMPLEX
export function createName(): Node[] {
  const node0 = new Node();
  node0.nodeType = NodeType.TEXT;
  node0.setProp(PropType.LABEL, 'First Name', false);
  node0.setProp(PropType.PLACEHOLDER, 'Enter first name...');
  node0.setProp(PropType.REQUIRED, true);
  node0.setProp(PropType.MAXLENGTHCHAR, 100, false);

  const node1 = new Node();
  node1.nodeType = NodeType.TEXT;
  node1.setProp(PropType.LABEL, 'Last Name', false);
  node1.setProp(PropType.PLACEHOLDER, 'Enter last name...');
  node1.setProp(PropType.REQUIRED, true);
  node1.setProp(PropType.MAXLENGTHCHAR, 100, false);
  return [node0, node1];
}

function createAddress() {
  return [new Node()];
}
function createGender() {
  return [new Node()];
}
function createBirthday() {
  return [new Node()];
}
function createBoolean() {
  return [new Node()];
}
