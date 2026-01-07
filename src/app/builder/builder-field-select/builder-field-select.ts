import { Component, Input } from '@angular/core';
import { Field } from '../../models/field-types';

@Component({
  selector: 'app-builder-field-select',
  imports: [],
  templateUrl: './builder-field-select.html',
  styleUrl: './builder-field-select.css',
})
export class BuilderFieldSelect {
  @Input() field!: Field;
}
