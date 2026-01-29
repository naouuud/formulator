import { Component, Input } from '@angular/core';
import { FieldType, OPTION_OTHER_TEXT } from '../../models/field-types';

@Component({
  selector: 'app-option-other',
  imports: [],
  templateUrl: './option-other.html',
  styleUrl: './option-other.css',
})
export class OptionOther {
  @Input() fieldType!: FieldType;
  OptionOtherText = OPTION_OTHER_TEXT;
  FieldType = FieldType;
}
