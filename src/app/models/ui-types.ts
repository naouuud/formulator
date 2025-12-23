import { GroupType } from './json-types';

export type UiType = {
  groupType: GroupType;
  label: string;
  description?: string;
  img: string;
  attribution: string;
};

export const uiTypes: UiType[] = [
  { label: 'Full Name', groupType: GroupType.NAME, img: 'user.png', attribution: 'Bharat Icons' },
  {
    label: 'Date of Birth',
    groupType: GroupType.BIRTHDAY,
    img: 'date-of-birth.png',
    attribution: 'Freepik',
  },
  {
    label: 'Gender',
    groupType: GroupType.GENDER,
    img: 'gender-fluid.png',
    attribution: 'Aranagraphics',
  },
  {
    label: 'Phone',
    description: '',
    groupType: GroupType.PHONE,
    img: 'smartphone-call.png',
    attribution: 'Freepik',
  },
  {
    label: 'Email',
    groupType: GroupType.EMAIL,
    img: 'email.png',
    attribution: 'Those Icons',
  },
  {
    label: 'Address',
    groupType: GroupType.ADDRESS,
    img: 'house.png',
    attribution: 'KP Arts',
  },
  {
    label: 'Short Text',
    description: 'Maximum length 100 characters.',
    groupType: GroupType.TEXT,
    img: 'font.png',
    attribution: 'Freepik',
  },
  {
    label: 'Long Text',
    description:
      'Ideal for comments, descriptions and essays. Set a word limit to keep answers concise.',
    groupType: GroupType.TEXTAREA,
    img: 'comment.png',
    attribution: 'Freepik',
  },
  {
    label: 'Dropdown',
    groupType: GroupType.SELECT,
    img: 'dropdown.png',
    attribution: 'Royyan Wijaya',
  },
  {
    label: 'Checkbox',
    description: 'Check all that apply.',
    groupType: GroupType.CHECKBOX,
    img: 'check.png',
    attribution: 'Picons',
  },
  {
    label: 'Radio',
    description: 'Check one option only.',
    groupType: GroupType.RADIO,
    img: 'radio.png',
    attribution: 'Bharat Icons',
  },
  {
    label: 'Any Date',
    groupType: GroupType.DATE,
    img: 'calendar.png',
    attribution: 'Freepik',
  },
  {
    label: 'Number',
    groupType: GroupType.NUMBER,
    img: 'pin.png',
    attribution: 'Fathema Khanom',
  },
  {
    label: 'Yes/No',
    groupType: GroupType.BOOLEAN,
    img: 'yes.png',
    attribution: 'Freepik',
  },
];
