import { Component } from '@angular/core';
import { testForm } from '../models/testing-models';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RendererField } from '../renderer-field/renderer-field';
import { Type, Section, Field, FormModel, NumberField, DateField } from '../models/json-types';
import { checkers } from '../models/typecheck-functions';

@Component({
  selector: 'app-renderer-form',
  imports: [RendererField, ReactiveFormsModule],
  templateUrl: './renderer-form.html',
  styleUrl: './renderer-form.css',
})
export class RendererForm {
  formGroup = new FormGroup({});
  form: FormModel = testForm;
  formFields: Field[] = [];

  constructor() {
    this._extractFields();
    this._buildFormGroup();
  }

  private _buildFormGroup(): void {
    this.formGroup = new FormGroup({});
    this.formFields.forEach((field: Field) => {
      const validators: any[] = [];
      switch (field.type) {
        case Type.TEXT:
        case Type.TEXTAREA:
          if (!checkers.isTextField(field) && !checkers.isTextareaField(field)) return;
          if (field.required) validators.push(Validators.required);
          validators.push(Validators.maxLength(field.maxLength));
          if (field.minLength > 1) validators.push(Validators.minLength(field.minLength));

          break;
        case Type.NUMBER:
          if (!checkers.isNumberField(field)) return;
          if (field.required) validators.push(Validators.required);
          validators.push(Validators.maxLength(field.maxLength));
          if (field.minLength > 1) validators.push(Validators.minLength(field.minLength));
          validators.push(Validators.pattern(field.pattern));
          validators.push(this._numberValueValidator(field));
          break;
        case Type.EMAIL:
          if (!checkers.isEmailField(field)) return;
          if (field.required) validators.push(Validators.required);
          validators.push(Validators.maxLength(field.maxLength));
          validators.push(Validators.email);

          break;
        case Type.PHONE:
          if (!checkers.isPhoneField(field)) return;
          if (field.required) validators.push(Validators.required);
          validators.push(Validators.maxLength(field.maxLength));
          if (field.minLength > 1) validators.push(Validators.minLength(field.minLength));
          validators.push(Validators.pattern(field.pattern));

          break;
        case Type.SELECT:
        case Type.RADIO: // includes Gender & Boolean
        case Type.CHECKBOX:
          if (
            !checkers.isSelectField(field) &&
            !checkers.isRadioField(field) &&
            !checkers.isCheckboxField(field)
          )
            return;
          if (field.required) validators.push(Validators.required);
          break;
        case Type.BIRTHDAY:
          if (!checkers.isBirthdayField(field)) return;
          if (field.required) validators.push(Validators.required);
          validators.push(this._dateValidator(field));
      }
      this.formGroup.addControl(field.fieldId, new FormControl<string | null>(null, validators));
    });
  }

  // Section[] to Field[]
  private _extractFields(): void {
    this.form.sections.forEach((section: Section) => {
      if (this._isField(section)) {
        this.formFields.push(section);
      } else {
        section.fields.forEach((section) => this.formFields.push(section));
      }
    });
  }

  // Type check function to distinguish Field and Group
  private _isField(section: any): section is Field {
    return !section.fields;
  }

  // Custom Validator for NumberField (factory returning ValidatorFn)
  private _numberValueValidator(field: NumberField): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value == null || value === '') return null; // ignore empty
      const numberValue = +value;
      if (Number.isNaN(numberValue)) return null; // validated by RegEx
      // in case NumberField properties are misconfigured
      const min = field.minValue ?? Number.NEGATIVE_INFINITY;
      const max = field.maxValue ?? Number.POSITIVE_INFINITY;
      if (numberValue < min) return { numberTooSmall: true };
      if (numberValue > max) return { numberTooLarge: true };
      return null;
    };
  }

  private _dateValidator(field: DateField): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // ignore empty values (use required validator instead)
      if (value == null || value === '') return null;
      // const selectedDate = new Date(value);
      const [year, month, day] = value.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      console.log(selectedDate);
      const maxDate = new Date(field.maxDate);
      const minDate = new Date(field.minDate);
      if (!isNaN(maxDate.getTime()) && selectedDate > maxDate) return { dateOutsideMaxRange: true };
      if (!isNaN(minDate.getTime()) && selectedDate < minDate) return { dateOutsideMinRange: true };
      return null;
    };
  }
}
