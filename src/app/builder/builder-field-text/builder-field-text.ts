import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Field } from '../../models/field-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../../builder-validation/builder-validation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-builder-field-text',
  imports: [BuilderPropLabel, BuilderValidation, ReactiveFormsModule, CommonModule],
  templateUrl: './builder-field-text.html',
  styleUrl: './builder-field-text.css',
})
export class BuilderFieldText {
  @Input() field!: Field;
}
