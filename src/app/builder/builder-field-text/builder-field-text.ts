import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Field } from '../../models/field-types';
import { Prop, PropChangeEvent, PropType } from '../../models/prop-types';
import { BuilderService } from '../../services/builder-service';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../../builder-validation/builder-validation';

@Component({
  selector: 'app-builder-field-text',
  imports: [BuilderPropLabel, BuilderValidation, ReactiveFormsModule],
  templateUrl: './builder-field-text.html',
  styleUrl: './builder-field-text.css',
})
export class BuilderFieldText implements OnInit {
  PropType = PropType;
  @Input() field!: Field;
  formGroup: FormGroup = new FormGroup({});

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this._buildFormGroup();
    this.formGroup.get('label')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.LABEL, value });
    });
    this.formGroup.get('required')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.REQUIRED, value });
    });
    this.formGroup.get('minlengthchar')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.MINLENGTHCHAR, value: Number(value) });
    });
    this.formGroup.get('maxlengthchar')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.MAXLENGTHCHAR, value: Number(value) });
    });
    this.formGroup.get('minlengthword')?.valueChanges.subscribe((value) => {
      this.setProp_C({ propType: PropType.MINLENGTHWORD, value: Number(value) });
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
