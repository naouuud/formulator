import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldType, Field } from '../../models/field-types';
import { CommonModule } from '@angular/common';
import { RendererTextarea } from '../renderer-textarea/renderer-textarea';
import { PropType } from '../../models/prop-types';

@Component({
  selector: 'app-renderer-field',
  imports: [CommonModule, ReactiveFormsModule, RendererTextarea],
  templateUrl: './renderer-field.html',
  styleUrl: './renderer-field.css',
})
export class RendererField {
  FieldType = FieldType;
  PropType = PropType;
  @Input() formGroupIn!: FormGroup;
  @Input() field!: Field;
  @Input() topLevel!: boolean;

  getFieldControl(id: string): AbstractControl {
    return this.formGroupIn.controls[id] ?? null;
  }
}
