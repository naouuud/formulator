import {
  CheckBoxField,
  AddressGroup,
  FormModel,
  NameGroup,
  CheckboxGroup,
  EmailGroup,
  TextareaGroup,
  GenderGroup,
  BirthdayGroup,
  PhoneGroup,
} from './json-types';

const nameTest: NameGroup = new NameGroup();
const checkTest: CheckboxGroup = new CheckboxGroup();
checkTest.groupLabel = 'Preferred contact methods';
(checkTest.fields[0] as CheckBoxField).options = [
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
const emailTest: EmailGroup = new EmailGroup();
const textareaTest: TextareaGroup = new TextareaGroup();
const addressTest: AddressGroup = new AddressGroup();
const genderTest: GenderGroup = new GenderGroup();
const birthdayTest: BirthdayGroup = new BirthdayGroup();
const phoneTest: PhoneGroup = new PhoneGroup();

export const testForm: FormModel = new FormModel();
testForm.formName = 'My First Form';
testForm.addGroup(
  nameTest,
  birthdayTest,
  genderTest,
  phoneTest,
  emailTest,
  addressTest,
  checkTest,
  textareaTest
);
