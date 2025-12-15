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
import { FieldI, FieldType, FormModel, TextField } from '../models/json-types';
import { checkers } from '../models/typecheck-functions';

@Component({
  selector: 'app-renderer-form',
  imports: [RendererField, ReactiveFormsModule],
  templateUrl: './renderer-form.html',
  styleUrl: './renderer-form.css',
})
export class RendererForm {
  formGroup = new FormGroup({});
  testForm = testForm;

  constructor() {
    this._buildFormGroup();
  }

  private controlName(field: FieldI): string {
    return `ctrl${field.fieldId}`;
  }

  private _buildFormGroup(): void {
    this.formGroup = new FormGroup({});
    testForm.fields.forEach((field: FieldI) => {
      switch (field.fieldType) {
        case FieldType.TEXT:
          if (!checkers.isTextField(field)) return;
          const validators: ValidatorFn[] = [];
          if (field.required) validators.push(Validators.required);
          validators.push(Validators.maxLength(field.maxLength));
          validators.push(Validators.minLength(field.minLength));
          this.formGroup.addControl(
            this.controlName(field),
            new FormControl<string | null>('', validators)
          );
          break;
      }
    });
  }
}
