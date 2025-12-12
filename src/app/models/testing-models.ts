import { CheckBoxField, DateField, SelectField, RadioField, TextField } from './json-types';

export const textTest: TextField = new TextField();
textTest.label = 'First Name';
textTest.maxLength = 36;
textTest.required = true;
textTest.placeholder = 'Enter first name here';

export const radioTest: RadioField = new RadioField();
radioTest.label = 'Favorite Fruit';
radioTest.required = true;
radioTest.options = [
  {
    label: 'Apple',
    value: 'apple',
  },
  {
    label: 'Banana',
    value: 'banana',
  },
  {
    label: 'Orange',
    value: 'orange',
  },
];

export const checkTest: CheckBoxField = new CheckBoxField();
checkTest.label = 'Preferred contact methods';
checkTest.options = [
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Phone',
    value: 'phone',
  },
  { label: 'Mail', value: 'mail' },
];

export const selectTest: SelectField = new SelectField();
selectTest.label = 'Country';
selectTest.required = true;
selectTest.options = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Australia', value: 'au' },
];
selectTest.placeholder = 'Select your country';

export const dateTest: DateField = new DateField();
dateTest.label = 'Date of Birth';
