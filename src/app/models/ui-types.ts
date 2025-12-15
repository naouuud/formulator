import { FieldType } from './json-types';

export type TypeModel = {
  name: string;
  description?: string;
  fieldType: string;
  img: string;
  attribution: string;
};

export const types: TypeModel[] = [
  { name: 'Full Name', fieldType: FieldType.NAME, img: 'user.png', attribution: 'Bharat Icons' },
  {
    name: 'Date of Birth',
    fieldType: FieldType.BIRTHDAY,
    img: 'date-of-birth.png',
    attribution: 'Freepik',
  },
  {
    name: 'Gender',
    fieldType: FieldType.RADIO,
    img: 'gender-fluid.png',
    attribution: 'Aranagraphics',
  },
  {
    name: 'Phone',
    description: '',
    fieldType: FieldType.TEXT,
    img: 'smartphone-call.png',
    attribution: 'Freepik',
  },
  {
    name: 'Email',
    fieldType: FieldType.EMAIL,
    img: 'email.png',
    attribution: 'Those Icons',
  },
  {
    name: 'Address',
    fieldType: FieldType.ADDRESS,
    img: 'house.png',
    attribution: 'KP Arts',
  },
  {
    name: 'Short Text',
    description: 'Maximum length 100 characters.',
    fieldType: FieldType.TEXT,
    img: 'font.png',
    attribution: 'Freepik',
  },
  {
    name: 'Long Text',
    description:
      'Ideal for comments, descriptions and essays. Set a word limit to keep answers concise.',
    fieldType: FieldType.TEXTAREA,
    img: 'comment.png',
    attribution: 'Freepik',
  },
  {
    name: 'Checkbox',
    description: 'Check all that apply.',
    fieldType: FieldType.CHECKBOX,
    img: 'check.png',
    attribution: 'Picons',
  },
  {
    name: 'Radio',
    description: 'Check one option only.',
    fieldType: FieldType.RADIO,
    img: 'radio.png',
    attribution: 'Bharat Icons',
  },
  {
    name: 'Dropdown',
    fieldType: FieldType.SELECT,
    img: 'dropdown.png',
    attribution: 'Royyan Wijaya',
  },
  {
    name: 'Any Date',
    fieldType: FieldType.DATE,
    img: 'calendar.png',
    attribution: 'Freepik',
  },
  {
    name: 'Number',
    fieldType: FieldType.NUMBER,
    img: 'pin.png',
    attribution: 'Fathema Khanom',
  },

  {
    name: 'Yes/No',
    fieldType: FieldType.RADIO,
    img: 'yes.png',
    attribution: 'Freepik',
  },
];
