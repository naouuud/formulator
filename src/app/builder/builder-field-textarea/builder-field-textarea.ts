import { Component, Input } from '@angular/core';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { Field } from '../../models/field-types';
import { PropType } from '../../models/prop-types';

@Component({
  selector: 'app-builder-field-textarea',
  imports: [BuilderPropLabel, BuilderValidation],
  templateUrl: './builder-field-textarea.html',
  styleUrl: './builder-field-textarea.css',
})
export class BuilderFieldTextarea {
  @Input() field!: Field;
  PropType = PropType;
}
