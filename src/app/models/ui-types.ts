export type TypeModel = {
  name: string;
  description?: string;
  value: string;
  img: string;
  attribution: string;
};

export const types: TypeModel[] = [
  {
    name: 'Short Text',
    description:
      'Text input with a maximum length of 100 characters. Ideal for names and addresses.',
    value: 'text',
    img: 'font.png',
    attribution: 'Freepik',
  },

  {
    name: 'Date',
    value: 'date',
    img: 'calendar.png',
    attribution: 'Freepik',
  },
  { name: 'Email', description: '', value: 'email', img: 'email.png', attribution: 'Those Icons' },
  {
    name: 'Checkbox',
    description: 'Check all that apply.',
    value: 'checkbox',
    img: 'check.png',
    attribution: 'Picons',
  },
  {
    name: 'Radio',
    description: 'Check one option only.',
    value: 'radio',
    img: 'radio.png',
    attribution: 'Bharat Icons',
  },
  { name: 'Dropdown', value: 'select', img: 'dropdown.png', attribution: 'Royyan Wijaya' },
  {
    name: 'Number',
    value: 'number',
    img: 'pin.png',
    attribution: 'Fathema Khanom',
  },
  {
    name: 'Long Text',
    description:
      'Ideal for comments, descriptions and essays. Set a word limit to keep answers concise.',
    value: 'textarea',
    img: 'comment.png',
    attribution: 'Freepik',
  },
];
