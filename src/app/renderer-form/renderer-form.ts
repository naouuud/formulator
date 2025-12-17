import { Component } from '@angular/core';
import { testForm } from '../models/testing-models';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RendererField } from '../renderer-field/renderer-field';
import { Type, Section, Field, FormModel } from '../models/json-types';
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
      const validators: ValidatorFn[] = [];
      switch (field.type) {
        case Type.TEXT:
          if (!checkers.isTextField(field)) return;
          if (field.required) validators.push(Validators.required);
          validators.push(Validators.maxLength(field.maxLength));
          if (field.minLength > 0) validators.push(Validators.minLength(field.minLength));
          this.formGroup.addControl(
            field.fieldId,
            new FormControl<string | null>(null, validators)
          );
          break;
        case Type.EMAIL:
          if (!checkers.isEmailField(field)) return;
          if (field.required) validators.push(Validators.required);
          validators.push(Validators.email);
          validators.push(Validators.maxLength(field.maxLength));
          this.formGroup.addControl(
            field.fieldId,
            new FormControl<string | null>(null, validators)
          );
          break;
        case Type.SELECT:
          if (!checkers.isSelectField(field)) return;
          if (field.required) validators.push(Validators.required);
          this.formGroup.addControl(
            field.fieldId,
            new FormControl<string | null>(null, validators)
          );
          break;
      }
    });
  }

  private _extractFields(): void {
    this.form.sections.forEach((section: Section) => {
      if (this._isField(section)) {
        this.formFields.push(section);
      } else {
        section.fields.forEach((section) => this.formFields.push(section));
      }
    });
  }

  private _isField(section: any): section is Field {
    return !section.fields;
  }
}
