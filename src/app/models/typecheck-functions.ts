import {
  AddressGroup,
  BirthdayField,
  CheckBoxField,
  DateField,
  EmailField,
  FieldI,
  FieldType,
  NameGroup,
  NumberField,
  PhoneField,
  RadioField,
  SelectField,
  TextareaField,
  TextField,
} from './json-types';

function isTextField(field: FieldI): field is TextField {
  return field.fieldType === FieldType.TEXT;
}

function isNumberField(field: FieldI): field is NumberField {
  return field.fieldType === FieldType.NUMBER;
}

function isSelectField(field: FieldI): field is SelectField {
  return field.fieldType === FieldType.SELECT;
}

function isRadioField(field: FieldI): field is RadioField {
  return field.fieldType === FieldType.RADIO;
}

function isCheckboxField(field: FieldI): field is CheckBoxField {
  return field.fieldType === FieldType.CHECKBOX;
}

function isEmailField(field: FieldI): field is EmailField {
  return field.fieldType === FieldType.EMAIL;
}

function isDateField(field: FieldI): field is DateField {
  return field.fieldType === FieldType.DATE;
}

function isBirthdayField(field: FieldI): field is BirthdayField {
  return field.fieldType === FieldType.BIRTHDAY;
}

function isTextareaField(field: FieldI): field is TextareaField {
  return field.fieldType === FieldType.TEXTAREA;
}

function isNameGroup(field: FieldI): field is NameGroup {
  return field.fieldType === FieldType.NAME;
}

function isAddressGroup(field: FieldI): field is AddressGroup {
  return field.fieldType === FieldType.ADDRESS;
}

function isPhoneField(field: FieldI): field is PhoneField {
  return field.fieldType === FieldType.PHONE;
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
