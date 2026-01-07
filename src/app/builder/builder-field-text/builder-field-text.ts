import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Field } from '../../models/field-types';
import { PropType } from '../../models/prop-types';

@Component({
  selector: 'app-builder-field-text',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-field-text.html',
  styleUrl: './builder-field-text.css',
})
export class BuilderFieldText implements OnInit {
  PropType = PropType;
  @Input() field!: Field;
  formGroup: FormGroup = new FormGroup({});
  array = Array.from({ length: 101 }, (_, i) => i);
  isValidationOpen = true;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      label: new FormControl(this.field.getPropValue(PropType.LABEL) ?? '', {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
      }),
      placeholder: new FormControl(this.field.getPropValue(PropType.PLACEHOLDER) ?? '', {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
      }),
      required: new FormControl(this.field.getPropValue(PropType.REQUIRED), { nonNullable: true }),
      maxlength: new FormControl(this.field.getPropValue(PropType.MAXLENGTH), {
        nonNullable: true,
      }),
      minlength: new FormControl(this.field.getPropValue(PropType.MINLENGTH), {
        nonNullable: true,
      }),
    });
  }
}
