import { Component, Input } from '@angular/core';
import { Field } from '../../models/field-types';

@Component({
  selector: 'app-builder-field-radio',
  imports: [],
  templateUrl: './builder-field-radio.html',
  styleUrl: './builder-field-radio.css',
})
export class BuilderFieldRadio {
  @Input() field!: Field;
}
