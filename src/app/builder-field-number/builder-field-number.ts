import { Component, Input } from '@angular/core';
import { Field } from '../models/field-types';
import { BuilderPropLabel } from '../builder/builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder/builder-validation/builder-validation';

@Component({
  selector: 'app-builder-field-number',
  imports: [BuilderPropLabel, BuilderValidation],
  templateUrl: './builder-field-number.html',
  styleUrl: './builder-field-number.css',
})
export class BuilderFieldNumber {
  @Input() field!: Field;
}
