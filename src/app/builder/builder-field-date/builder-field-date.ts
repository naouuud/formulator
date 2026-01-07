import { Component, Input } from '@angular/core';
import { Field } from '../../models/field-types';

@Component({
  selector: 'app-builder-field-date',
  imports: [],
  templateUrl: './builder-field-date.html',
  styleUrl: './builder-field-date.css',
})
export class BuilderFieldDate {
  @Input() field!: Field;
}
