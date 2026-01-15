import { Component, Input, OnInit } from '@angular/core';
import { Field, FieldType } from '../../models/field-types';
import { BuilderFieldText } from '../builder-field-text/builder-field-text';
import { BuilderFieldRadio } from '../builder-field-radio/builder-field-radio';
import { BuilderFieldDate } from '../builder-field-date/builder-field-date';
import { BuilderFieldSelect } from '../builder-field-select/builder-field-select';
import { BuilderService } from '../../services/builder-service';
import { Prop, PropChangeEvent, PropType } from '../../models/prop-types';
import {
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
    BuilderFieldRadio,
    BuilderFieldDate,
    ReactiveFormsModule,
  ],
  templateUrl: './builder-field.html',
  styleUrl: './builder-field.css',
})
export class BuilderField implements OnInit {
  FieldType = FieldType;
  PropType = PropType;
  formGroup: FormGroup = new FormGroup({});
  @Input() field!: Field;

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this._buildFormGroup();
    this.formGroup.get('label')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.LABEL, value });
    });
    this.formGroup.get('required')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.REQUIRED, value });
    });
    this.formGroup.get('maxlengthchar')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.MAXLENGTHCHAR, value: Number(value) });
    });
    this.formGroup.get('maxlengthword')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.MAXLENGTHWORD, value: Number(value) });
    });
  }

  setProp_C(propChangeEvent: PropChangeEvent) {
    const { propType, value } = propChangeEvent;
    this.builderService.setProp_S(this.field, propType, value);
  }

  private _buildFormGroup(): void {
    this.field.props.forEach((prop: Prop) => {
      const validators: ValidatorFn[] = [];
      switch (prop.propType) {
        case PropType.LABEL:
          validators.push(Validators.maxLength(100));
          break;
      }
      const control = new FormControl(prop.value, { nonNullable: true, validators });
      if (!prop.editable) control.disable();
      this.formGroup.addControl(prop.propType, control);
    });
  }
}
