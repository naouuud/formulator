import { Type } from './json-types';

export type TypeModel = {
  name: string;
  description?: string;
  fieldType: string;
  img: string;
  attribution: string;
};

export const types: TypeModel[] = [
  { name: 'Full Name', fieldType: Type.NAME, img: 'user.png', attribution: 'Bharat Icons' },
  {
    name: 'Date of Birth',
    fieldType: Type.BIRTHDAY,
    img: 'date-of-birth.png',
    attribution: 'Freepik',
  },
  {
    name: 'Gender',
    fieldType: Type.GENDER,
    img: 'gender-fluid.png',
    attribution: 'Aranagraphics',
  },
  {
    name: 'Phone',
    description: '',
    fieldType: Type.PHONE,
    img: 'smartphone-call.png',
    attribution: 'Freepik',
  },
  {
    name: 'Email',
    fieldType: Type.EMAIL,
    img: 'email.png',
    attribution: 'Those Icons',
  },
  {
    name: 'Address',
    fieldType: Type.ADDRESS,
    img: 'house.png',
    attribution: 'KP Arts',
  },
  {
    name: 'Short Text',
    description: 'Maximum length 100 characters.',
    fieldType: Type.TEXT,
    img: 'font.png',
    attribution: 'Freepik',
  },
  {
    name: 'Long Text',
    description:
      'Ideal for comments, descriptions and essays. Set a word limit to keep answers concise.',
    fieldType: Type.TEXTAREA,
    img: 'comment.png',
    attribution: 'Freepik',
  },
  {
    name: 'Dropdown',
    fieldType: Type.SELECT,
    img: 'dropdown.png',
    attribution: 'Royyan Wijaya',
  },
  {
    name: 'Checkbox',
    description: 'Check all that apply.',
    fieldType: Type.CHECKBOX,
    img: 'check.png',
    attribution: 'Picons',
  },
  {
    name: 'Radio',
    description: 'Check one option only.',
    fieldType: Type.RADIO,
    img: 'radio.png',
    attribution: 'Bharat Icons',
  },
  {
    name: 'Any Date',
    fieldType: Type.DATE,
    img: 'calendar.png',
    attribution: 'Freepik',
  },
  {
    name: 'Number',
    fieldType: Type.NUMBER,
    img: 'pin.png',
    attribution: 'Fathema Khanom',
  },
  {
    name: 'Yes/No',
    fieldType: Type.BOOLEAN,
    img: 'yes.png',
    attribution: 'Freepik',
  },
];
