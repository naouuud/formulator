import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Field, FieldType } from '../../models/field-types';
import { Prop, PropChangeEvent, PropType } from '../../models/prop-types';
import { BuilderService } from '../../services/builder-service';
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
