import { Component, Input } from '@angular/core';
import { Field, Option } from '../../models/field-types';

@Component({
  selector: 'app-custom-checkbox',
  imports: [],
  templateUrl: './custom-checkbox.html',
  styleUrl: './custom-checkbox.css',
})
export class CustomCheckbox {
  @Input() field!: Field;
  @Input() option!: Option;
  // @Input() index!: number;
}
