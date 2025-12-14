import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../models/json-types';
import { RendererDate } from '../renderer-date-field/renderer-date';
import { CommonModule } from '@angular/common';
import { RendererTextarea } from '../renderer-textarea/renderer-textarea';
import { RendererAddress } from '../renderer-address/renderer-address';
import { RendererName } from '../renderer-name/renderer-name';
import { RendererBirthday } from '../renderer-birthday/renderer-birthday';

@Component({
  selector: 'app-renderer-field',
  imports: [
    CommonModule,
    RendererDate,
    RendererTextarea,
    RendererAddress,
    RendererName,
    RendererBirthday,
  ],
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
