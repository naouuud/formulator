import { Component, Input } from '@angular/core';
import { Field, FieldType } from '../../models/field-types';
import { BuilderFieldCheckbox } from '../builder-field-checkbox/builder-field-checkbox';
import { BuilderFieldText } from '../builder-field-text/builder-field-text';
import { BuilderFieldRadio } from '../builder-field-radio/builder-field-radio';
import { BuilderFieldDate } from '../builder-field-date/builder-field-date';
import { BuilderFieldSelect } from '../builder-field-select/builder-field-select';
import { BuilderFieldTextarea } from '../builder-field-textarea/builder-field-textarea';

@Component({
  selector: 'app-builder-field',
  imports: [
    BuilderFieldText,
    BuilderFieldTextarea,
    BuilderFieldCheckbox,
    BuilderFieldRadio,
    BuilderFieldDate,
    BuilderFieldSelect,
  ],
  templateUrl: './builder-field.html',
  styleUrl: './builder-field.css',
})
export class BuilderField {
  FieldType = FieldType;
  // @Input() formModel!: FormModel;
  @Input() field!: Field;
}
