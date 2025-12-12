import { Component } from '@angular/core';
import { FormModel } from '../models/json-types';
import { checkTest, dateTest, radioTest, selectTest, textTest } from '../models/testing-models';
import { FormGroup } from '@angular/forms';
import { RendererField } from '../renderer-field/renderer-field';

@Component({
  selector: 'app-renderer-form',
  imports: [RendererField],
  templateUrl: './renderer-form.html',
  styleUrl: './renderer-form.css',
})
export class RendererForm {
  formGroup = new FormGroup({});
  form: FormModel = [textTest, radioTest, checkTest, selectTest, dateTest];

  constructor() {}
}
