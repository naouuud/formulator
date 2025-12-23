import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PropType, FieldType, Field } from '../../models/json-types';
import { RendererDate } from '../renderer-date-field/renderer-date';
import { CommonModule } from '@angular/common';
import { RendererTextarea } from '../renderer-textarea/renderer-textarea';
import { RendererBirthday } from '../renderer-birthday/renderer-birthday';
import { checkers } from '../../models/typecheck-functions';

@Component({
  selector: 'app-renderer-field',
  imports: [CommonModule, ReactiveFormsModule, RendererBirthday, RendererDate, RendererTextarea],
  templateUrl: './renderer-field.html',
  styleUrl: './renderer-field.css',
})
export class RendererField implements OnInit {
  FieldType = FieldType;
  PropType = PropType;
  checkers = checkers;
  @Input() formGroupIn!: FormGroup;
  @Input() field!: Field;

  ngOnInit() {
    console.log(this.field);
  }

  getFieldControl(id: string): AbstractControl {
    return this.formGroupIn.controls[id] ?? null;
  }
}
