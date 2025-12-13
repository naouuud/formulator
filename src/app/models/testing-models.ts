import {
  CheckBoxField,
  DateField,
  SelectField,
  RadioField,
  TextField,
  BooleanField,
  SentimentField,
  NumberField,
  EmailField,
  TextareaField,
} from './json-types';

export const textTest: TextField = new TextField();
textTest.label = 'First Name';
textTest.maxLength = 20;
textTest.required = true;
textTest.placeholder = 'Enter first name...';

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

export const booleanTest: BooleanField = new BooleanField();
booleanTest.label = 'Do you wish to receive promotional emails?';

export const sentimentTest: SentimentField = new SentimentField();
sentimentTest.label = 'My room is very organized';

export const numberTest: NumberField = new NumberField();
numberTest.maxValue = 20;
numberTest.label = 'How many siblings do you have?';
numberTest.maxLength = 5;

export const emailTest: EmailField = new EmailField();

export const textareaTest: TextareaField = new TextareaField();
textareaTest.label = 'Please explain why are you interested in this grant (max 500 words)';
textareaTest.maxLength = 500;
