import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../models/json-types';
import { RendererDateField } from '../renderer-date-field/renderer-date-field';
import { CommonModule } from '@angular/common';
import { RendererTextarea } from '../renderer-textarea/renderer-textarea';

@Component({
  selector: 'app-renderer-field',
  imports: [RendererDateField, RendererTextarea, CommonModule],
  templateUrl: './renderer-field.html',
  styleUrl: './renderer-field.css',
})
export class RendererField implements OnInit {
  FieldType = FieldType;
  @Input() formGroupIn!: FormGroup;
  @Input() field!: any;

  ngOnInit() {
    console.log(this.field);
  }
}
