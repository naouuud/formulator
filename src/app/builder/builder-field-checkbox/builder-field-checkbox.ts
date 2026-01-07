import { Component, Input } from '@angular/core';
import { Field } from '../../models/field-types';

@Component({
  selector: 'app-builder-field-checkbox',
  imports: [],
  templateUrl: './builder-field-checkbox.html',
  styleUrl: './builder-field-checkbox.css',
})
export class BuilderFieldCheckbox {
  @Input() field!: Field;
}
