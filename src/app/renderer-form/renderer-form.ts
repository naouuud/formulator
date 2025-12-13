import { Component } from '@angular/core';
import {
  addressTest,
  booleanTest,
  checkTest,
  dateTest,
  emailTest,
  numberTest,
  radioTest,
  selectTest,
  sentimentTest,
  testForm,
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
  testForm = testForm;
}
