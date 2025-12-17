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
  AddressGroup,
  FormModel,
  NameGroup,
  GenderField,
  BirthdayField,
  PhoneField,
} from './json-types';

const nameTest: NameGroup = new NameGroup();

const textTest: TextField = new TextField();
textTest.label = 'Favorite Animal';
textTest.maxLength = 20;
textTest.required = true;
textTest.placeholder = 'Enter your favorite animal...';

const radioTest: RadioField = new RadioField();
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

const checkTest: CheckBoxField = new CheckBoxField();
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

const selectTest: SelectField = new SelectField();
selectTest.label = 'Country';
selectTest.required = true;
selectTest.options = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Australia', value: 'au' },
];
selectTest.placeholder = 'Select your country';

const dateTest: DateField = new DateField();
dateTest.label = 'Date you moved/will move to this address';

const booleanTest: BooleanField = new BooleanField();
booleanTest.label = 'Do you wish to receive promotional emails?';
booleanTest.includeUnsure(true);

const sentimentTest: SentimentField = new SentimentField();
sentimentTest.label = 'My room is very organized';

const numberTest: NumberField = new NumberField();
numberTest.maxValue = 20;
numberTest.label = 'How many siblings do you have?';
numberTest.maxLength = 5;

const emailTest: EmailField = new EmailField();

const textareaTest: TextareaField = new TextareaField();
textareaTest.label = 'Please explain why are you interested in this grant (max. 500 words)';
textareaTest.maxLength = 500;

const addressTest: AddressGroup = new AddressGroup();

const genderTest: GenderField = new GenderField();
genderTest.label = 'Gender';
genderTest.includeNonBinary(true);

const birthdayTest = new BirthdayField();
birthdayTest.label = 'Date of Birth';

const phoneTest: PhoneField = new PhoneField();

export const testForm: FormModel = new FormModel();
testForm.name = 'My First Form';
testForm.sections = [
  nameTest,
  birthdayTest,
  genderTest,
  phoneTest,
  emailTest,
  addressTest,
  checkTest,
  textareaTest,
  // textTest,
  // radioTest,
  // selectTest,
  // dateTest,
  // booleanTest,
  // sentimentTest,
  // numberTest,
];
