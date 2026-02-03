import { Component, Input, OnInit } from '@angular/core';
import { Field, FieldType } from '../../models/field-types';
import { BuilderFieldText } from '../builder-field-text/builder-field-text';
import { BuilderFieldOption } from '../builder-field-option/builder-field-option';
import { BuilderFieldDate } from '../builder-field-date/builder-field-date';
import { BuilderFieldSelect } from '../builder-field-select/builder-field-select';
import { BuilderService } from '../../services/builder-service';
import { Prop, PropChangeEvent, PropType } from '../../models/prop-types';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BuilderFieldTextarea } from '../builder-field-textarea/builder-field-textarea';
import { BuilderFieldNumber } from '../../builder-field-number/builder-field-number';

@Component({
  selector: 'app-builder-field',
  imports: [ReactiveFormsModule],
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
    const labelControl = this.formGroupIn.get('label');
    labelControl?.valueChanges.subscribe((value: unknown) => {
      // if (labelControl?.errors) return;
      this.setProp_C({ propType: PropType.LABEL, value });
    });
    const requiredControl = this.formGroupIn.get('required');
    requiredControl?.valueChanges.subscribe((value: unknown) => {
      // if (requiredControl?.errors) return;
      this.setProp_C({ propType: PropType.REQUIRED, value });
    });
    const maxLengthCharControl = this.formGroupIn.get('maxlengthchar');
    maxLengthCharControl?.valueChanges.subscribe((value: unknown) => {
      // if (this.formGroupIn.get('label')?.errors) return;
      this.setProp_C({ propType: PropType.MAXLENGTHCHAR, value: Number(value) });
    });
    const maxLengthWordControl = this.formGroupIn.get('maxlengthword');
    maxLengthWordControl?.valueChanges.subscribe((value: unknown) => {
      // if (maxLengthWordControl?.errors) return;
      this.setProp_C({ propType: PropType.MAXLENGTHWORD, value: Number(value) });
    });
    const optionOtherControl = this.formGroupIn.get('optionother');
    optionOtherControl?.valueChanges.subscribe((value: unknown) => {
      // if (optionOtherControl.errors) return;
      this.setProp_C({ propType: PropType.OPTIONOTHER, value });
    });
  }

  setProp_C(propChangeEvent: PropChangeEvent) {
    const { propType, value } = propChangeEvent;
    // this.builderService.setProp_S(this.field, propType, value);
  }
}
