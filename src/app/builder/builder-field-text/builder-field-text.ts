import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Field } from '../../models/field-types';
import { Prop, PropChangeEvent, PropType, PropValueMap } from '../../models/prop-types';
import { BuilderService } from '../../services/builder-service';
import { throttleTime } from 'rxjs';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';

@Component({
  selector: 'app-builder-field-text',
  imports: [ReactiveFormsModule, BuilderPropLabel],
  templateUrl: './builder-field-text.html',
  styleUrl: './builder-field-text.css',
})
export class BuilderFieldText implements OnInit {
  PropType = PropType;
  @Input() field!: Field;
  formGroup: FormGroup = new FormGroup({});
  array = Array.from({ length: 101 }, (_, i) => i);
  isValidationOpen = true;

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    // this.formGroup = new FormGroup({
    //   label: new FormControl(this.field.getPropValue(PropType.LABEL) ?? '', {
    //     nonNullable: true,
    //     validators: [Validators.maxLength(100)],
    //   }),
    //   placeholder: new FormControl(this.field.getPropValue(PropType.PLACEHOLDER) ?? '', {
    //     nonNullable: true,
    //     validators: [Validators.maxLength(100)],
    //   }),
    //   required: new FormControl(this.field.getPropValue(PropType.REQUIRED), { nonNullable: true }),
    //   maxlength: new FormControl(this.field.getPropValue(PropType.MAXLENGTH), {
    //     nonNullable: true,
    //   }),
    //   minlength: new FormControl(this.field.getPropValue(PropType.MINLENGTH), {
    //     nonNullable: true,
    //   }),
    // });
    this._buildFormGroup();
  }

  setProp_C(valueIn: PropChangeEvent) {
    const { propType, value } = valueIn;
    this.builderService.setProp_S(this.field, propType, value);
  }

  private _buildFormGroup(): void {
    this.field.props.forEach((prop: Prop) => {
      const validators: ValidatorFn[] = [];
      switch (prop.propType) {
        case PropType.LABEL:
          validators.push(Validators.maxLength(100));
      }
      const control = new FormControl(prop.value, { nonNullable: true, validators });
      this.formGroup.addControl(prop.propType, control);
    });
  }
}
