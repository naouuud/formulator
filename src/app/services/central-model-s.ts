import { Injectable } from '@angular/core';
import {
  AddressGroup,
  BirthdayField,
  BooleanField,
  CheckBoxField,
  DateField,
  EmailField,
  FormModel,
  GenderField,
  NameGroup,
  NumberField,
  PhoneField,
  RadioField,
  SelectField,
  TextareaField,
  TextField,
  FieldType,
} from '../models/json-types';

@Injectable({
  providedIn: 'root',
})
export class CentralModelS {
  // formModel: FormModel = new FormModel();
  // private readonly fieldMap = new Map<FieldType, () => Section>([
  //   [FieldType.NAME, () => new NameGroup()],
  //   [FieldType.BIRTHDAY, () => new BirthdayField()],
  //   [FieldType.GENDER, () => new GenderField()],
  //   [FieldType.PHONE, () => new PhoneField()],
  //   [FieldType.EMAIL, () => new EmailField()],
  //   [FieldType.ADDRESS, () => new AddressGroup()],
  //   [FieldType.TEXT, () => new TextField()],
  //   [FieldType.TEXTAREA, () => new TextareaField()],
  //   [FieldType.CHECKBOX, () => new CheckBoxField()],
  //   [FieldType.RADIO, () => new RadioField()],
  //   [FieldType.SELECT, () => new SelectField()],
  //   [FieldType.DATE, () => new DateField()],
  //   [FieldType.NUMBER, () => new NumberField()],
  //   [FieldType.BOOLEAN, () => new BooleanField()],
  // ]);
  // constructor() {
  //   // TEST FORM (BUILDER)
  //   for (const type of Object.values(FieldType)) {
  //     this.createSection(type);
  //   }
  // }
  // createSection(type: FieldType): void {
  //   const factory = this.fieldMap.get(type);
  //   if (!factory) return;
  //   this.formModel.addGroup(factory());
  // }
}
