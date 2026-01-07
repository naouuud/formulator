import { Component, Input } from '@angular/core';
import { Field } from '../../models/field-types';

@Component({
  selector: 'app-builder-field-textarea',
  imports: [],
  templateUrl: './builder-field-textarea.html',
  styleUrl: './builder-field-textarea.css',
})
export class BuilderFieldTextarea {
  @Input() field!: Field;
}
