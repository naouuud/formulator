import {
  Field,
  BirthdayField,
  CheckBoxField,
  DateField,
  EmailField,
  FieldType,
  NumberField,
  PhoneField,
  RadioField,
  SelectField,
  TextareaField,
  TextField,
} from './json-types';

function isTextField(field: Field): field is TextField {
  return field.fieldType === FieldType.TEXT;
}

function isNumberField(field: Field): field is NumberField {
  return field.fieldType === FieldType.NUMBER;
}

function isSelectField(field: Field): field is SelectField {
  return field.fieldType === FieldType.SELECT;
}

function isRadioField(field: Field): field is RadioField {
  return (
    field.fieldType === FieldType.RADIO ||
    field.fieldType === FieldType.GENDER ||
    field.fieldType === FieldType.BOOLEAN
  );
}

function isCheckboxField(field: Field): field is CheckBoxField {
  return field.fieldType === FieldType.CHECKBOX;
}

function isEmailField(field: Field): field is EmailField {
  return field.fieldType === FieldType.EMAIL;
}

function isDateField(field: Field): field is DateField {
  return field.fieldType === FieldType.DATE;
}

function isBirthdayField(field: Field): field is BirthdayField {
  return field.fieldType === FieldType.BIRTHDAY;
}

function isTextareaField(field: Field): field is TextareaField {
  return field.fieldType === FieldType.TEXTAREA;
}

function isPhoneField(field: Field): field is PhoneField {
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
};
