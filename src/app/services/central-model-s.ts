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
  Section,
  SelectField,
  TextareaField,
  TextField,
  Type,
} from '../models/json-types';

@Injectable({
  providedIn: 'root',
})
export class CentralModelS {
  formModel: FormModel = new FormModel();

  private readonly fieldMap = new Map<Type, () => Section>([
    [Type.NAME, () => new NameGroup()],
    [Type.BIRTHDAY, () => new BirthdayField()],
    [Type.GENDER, () => new GenderField()],
    [Type.PHONE, () => new PhoneField()],
    [Type.EMAIL, () => new EmailField()],
    [Type.ADDRESS, () => new AddressGroup()],
    [Type.TEXT, () => new TextField()],
    [Type.TEXTAREA, () => new TextareaField()],
    [Type.CHECKBOX, () => new CheckBoxField()],
    [Type.RADIO, () => new RadioField()],
    [Type.SELECT, () => new SelectField()],
    [Type.DATE, () => new DateField()],
    [Type.NUMBER, () => new NumberField()],
    [Type.BOOLEAN, () => new BooleanField()],
  ]);

  createSection(type: Type): void {
    const factory = this.fieldMap.get(type);
    if (!factory) return;
    this.formModel.addSection(factory());
  }
}
