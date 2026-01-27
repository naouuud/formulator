import { Component, Input, OnInit } from '@angular/core';
import { Field, FieldType } from '../../models/field-types';
import { BuilderFieldText } from '../builder-field-text/builder-field-text';
import { BuilderFieldOption } from '../builder-field-option/builder-field-option';
import { BuilderFieldDate } from '../builder-field-date/builder-field-date';
import { BuilderFieldSelect } from '../builder-field-select/builder-field-select';
import { BuilderService } from '../../services/builder-service';
import { Prop, PropChangeEvent, PropType } from '../../models/prop-types';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BuilderFieldTextarea } from '../builder-field-textarea/builder-field-textarea';

@Component({
  selector: 'app-builder-field',
  imports: [
    BuilderFieldText,
    BuilderFieldTextarea,
    BuilderFieldSelect,
    BuilderFieldOption,
    BuilderFieldDate,
    ReactiveFormsModule,
  ],
  templateUrl: './builder-field.html',
  styleUrl: './builder-field.css',
})
export class BuilderField implements OnInit {
  FieldType = FieldType;
  PropType = PropType;
  @Input() formGroupIn!: FormGroup;
  @Input() field!: Field;

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this.formGroupIn.get('label')?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.LABEL, value });
    });
    this.formGroupIn.get('required')?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.REQUIRED, value });
    });
    this.formGroupIn.get('maxlengthchar')?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.MAXLENGTHCHAR, value: Number(value) });
    });
    this.formGroupIn.get('maxlengthword')?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.MAXLENGTHWORD, value: Number(value) });
    });
    this.formGroupIn.get('optionother')?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.OPTIONOTHER, value });
    });
    // Date range handled in own component due to complexity
    // this.formGroup.get('daterange')?.valueChanges.subscribe((value: unknown) => {
    //   this.setProp_C({ propType: PropType.DATERANGE, value });
    // });
  }

  setProp_C(propChangeEvent: PropChangeEvent) {
    const { propType, value } = propChangeEvent;
    this.builderService.setProp_S(this.field, propType, value);
  }
}
