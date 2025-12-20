import {
  AddressGroup,
  BirthdayField,
  CheckBoxField,
  DateField,
  EmailField,
  Type,
  NameGroup,
  NumberField,
  PhoneField,
  RadioField,
  SelectField,
  TextareaField,
  TextField,
  Section,
} from './json-types';

function isTextField(section: Section): section is TextField {
  return section.type === Type.TEXT;
}

function isNumberField(section: Section): section is NumberField {
  return section.type === Type.NUMBER;
}

function isSelectField(section: Section): section is SelectField {
  return section.type === Type.SELECT;
}

function isRadioField(section: Section): section is RadioField {
  return (
    section.type === Type.RADIO || section.type === Type.GENDER || section.type === Type.BOOLEAN
  );
}

function isCheckboxField(section: Section): section is CheckBoxField {
  return section.type === Type.CHECKBOX;
}

function isEmailField(section: Section): section is EmailField {
  return section.type === Type.EMAIL;
}

function isDateField(section: Section): section is DateField {
  return section.type === Type.DATE;
}

function isBirthdayField(section: Section): section is BirthdayField {
  return section.type === Type.BIRTHDAY;
}

function isTextareaField(section: Section): section is TextareaField {
  return section.type === Type.TEXTAREA;
}

function isNameGroup(group: Section): group is NameGroup {
  return group.type === Type.NAME;
}

function isAddressGroup(group: Section): group is AddressGroup {
  return group.type === Type.ADDRESS;
}

function isPhoneField(section: Section): section is PhoneField {
  return section.type === Type.PHONE;
}

export const checkers = {
  isTextField,
  isNumberField,
  isSelectField,
  isRadioField,
  isCheckboxField,
  isEmailField,
  isDateField,
  isBirthdayField,
  isTextareaField,
  isPhoneField,
  isNameGroup,
  isAddressGroup,
};
