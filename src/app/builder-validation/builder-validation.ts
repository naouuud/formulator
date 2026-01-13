import { Component, Input, input } from '@angular/core';
import { PropType } from '../models/prop-types';
import { Field } from '../models/field-types';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-builder-validation',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-validation.html',
  styleUrl: './builder-validation.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderValidation {
  @Input() field!: Field;
  PropType = PropType;
  arrayChar = this._arrayRange(0, 100, 1);
  arrayWord = this._arrayRange(0, 1000, 50);
  isValidationOpen = true;

  constructor(public controlContainer: ControlContainer) {}

  private _arrayRange(start: number, stop: number, step: number) {
    return Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
  }
}
