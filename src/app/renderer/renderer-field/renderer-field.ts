import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldType, Field } from '../../models/field-types';
import { RendererDate } from '../renderer-date-field/renderer-date';
import { CommonModule } from '@angular/common';
import { RendererTextarea } from '../renderer-textarea/renderer-textarea';
import { RendererBirthday } from '../renderer-birthday/renderer-birthday';
import { PropType } from '../../models/prop-types';

@Component({
  selector: 'app-renderer-field',
  imports: [CommonModule, ReactiveFormsModule, RendererTextarea, RendererBirthday],
  templateUrl: './renderer-field.html',
  styleUrl: './renderer-field.css',
})
export class RendererField implements OnInit {
  FieldType = FieldType;
  PropType = PropType;
  @Input() formGroupIn!: FormGroup;
  @Input() field!: Field;

  ngOnInit() {
    console.log(this.field);
  }

  getFieldControl(id: string): AbstractControl {
    return this.formGroupIn.controls[id] ?? null;
  }
}
