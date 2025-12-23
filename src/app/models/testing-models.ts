import {
  AddressGroup,
  FormModel,
  NameGroup,
  CheckboxGroup,
  EmailGroup,
  TextareaGroup,
  GenderGroup,
  BirthdayGroup,
  PhoneGroup,
} from './group-types';
import { CheckBoxField } from './field-types';
import { PropType } from './prop-types';

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
textareaTest.fields[0].setProp(
  PropType.LABEL,
  'Please explain why are you are applying to this program (max. 500 words)'
);
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
