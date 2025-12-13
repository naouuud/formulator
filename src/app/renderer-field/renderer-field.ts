import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../models/json-types';
import { RendererDateField } from '../renderer-date-field/renderer-date-field';
import { CommonModule } from '@angular/common';
import { RendererTextarea } from '../renderer-textarea/renderer-textarea';
import { RendererAddress } from '../renderer-address/renderer-address';

@Component({
  selector: 'app-renderer-field',
  imports: [CommonModule, RendererDateField, RendererTextarea, RendererAddress],
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
