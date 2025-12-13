import { Component } from '@angular/core';
import {
  booleanTest,
  checkTest,
  dateTest,
  emailTest,
  numberTest,
  radioTest,
  selectTest,
  sentimentTest,
  textareaTest,
  textTest,
} from '../models/testing-models';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RendererField } from '../renderer-field/renderer-field';
import { FormModel } from '../models/json-types';

@Component({
  selector: 'app-renderer-form',
  imports: [RendererField, ReactiveFormsModule],
  templateUrl: './renderer-form.html',
  styleUrl: './renderer-form.css',
})
export class RendererForm {
  formGroup = new FormGroup({});
  testForm: FormModel = new FormModel();

  constructor() {
    this.testForm.name = 'Test Form';
    this.testForm.fields = [
      textTest,
      radioTest,
      checkTest,
      selectTest,
      dateTest,
      booleanTest,
      sentimentTest,
      numberTest,
      emailTest,
      textareaTest,
    ];
  }
}
