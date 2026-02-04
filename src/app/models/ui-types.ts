import { NodeType } from './node-types';

export type UiType = {
  nodeType: NodeType;
  label: string;
  description?: string;
  img: string;
  attribution: string;
};

export const uiTypesCustom: UiType[] = [
  {
    label: 'Short Text',
    description: 'Maximum length 100 characters.',
    nodeType: NodeType.TEXT,
    img: 'font.png',
    attribution: 'Freepik',
  },
  {
    label: 'Long Text',
    description:
      'Ideal for comments, descriptions and essays. Set a word limit to keep answers concise.',
    nodeType: NodeType.TEXTAREA,
    img: 'comment.png',
    attribution: 'Freepik',
  },
  {
    label: 'Number',
    nodeType: NodeType.NUMBER,
    img: 'pin.png',
    attribution: 'Fathema Khanom',
  },
  {
    label: 'Phone',
    description: '',
    nodeType: NodeType.PHONE,
    img: 'smartphone-call.png',
    attribution: 'Freepik',
  },
  {
    label: 'Email',
    nodeType: NodeType.EMAIL,
    img: 'email.png',
    attribution: 'Those Icons',
  },
  {
    label: 'Date',
    nodeType: NodeType.DATE,
    img: 'calendar.png',
    attribution: 'Freepik',
  },
  {
    label: 'Dropdown',
    description: 'Select an option.',
    nodeType: NodeType.SELECT,
    img: 'dropdown.png',
    attribution: 'Royyan Wijaya',
  },
  {
    label: 'Checkbox',
    description: 'Check all that apply.',
    nodeType: NodeType.CHECKBOX,
    img: 'check.png',
    attribution: 'Picons',
  },
  {
    label: 'Radio',
    description: 'Check one option only.',
    nodeType: NodeType.RADIO,
    img: 'radio.png',
    attribution: 'Bharat Icons',
  },
];

export const uiTypesBasic: UiType[] = [
  // { label: 'Full Name', groupType: GroupType.NAME, img: 'user.png', attribution: 'Bharat Icons' },
  // {
  //   label: 'Date of Birth',
  //   groupType: GroupType.BIRTHDAY,
  //   img: 'date-of-birth.png',
  //   attribution: 'Freepik',
  // },
  // {
  //   label: 'Gender',
  //   groupType: GroupType.GENDER,
  //   img: 'gender-fluid.png',
  //   attribution: 'Aranagraphics',
  // },
  // {
  // {
  //   label: 'Address',
  //   groupType: GroupType.ADDRESS,
  //   img: 'house.png',
  //   attribution: 'KP Arts',
  // },
  // {
  //   label: 'Yes/No',
  //   groupType: GroupType.BOOLEAN,
  //   img: 'yes.png',
  //   attribution: 'Freepik',
  // },
];
