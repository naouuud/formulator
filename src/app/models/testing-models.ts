import { Radio, Text } from './json-types';

export const textTest: Text = new Text();
textTest.label = 'First Name';
textTest.maxLength = 36;
textTest.required = true;
textTest.placeholder = 'Enter first name here';

export const radioTest: Radio = new Radio();
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
