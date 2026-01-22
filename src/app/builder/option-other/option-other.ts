import { Component, Input } from '@angular/core';
import { FieldType, OptionOtherText } from '../../models/field-types';

@Component({
  selector: 'app-option-other',
  imports: [],
  templateUrl: './option-other.html',
  styleUrl: './option-other.css',
})
export class OptionOther {
  @Input() fieldType!: FieldType;
  OptionOtherText = OptionOtherText;
  FieldType = FieldType;
}
