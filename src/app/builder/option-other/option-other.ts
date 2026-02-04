import { Component, Input } from '@angular/core';
import { OPTION_OTHER_TEXT } from '../../models/field-types';
import { NodeType } from '../../models/node-types';

@Component({
  selector: 'app-option-other',
  imports: [],
  templateUrl: './option-other.html',
  styleUrl: './option-other.css',
})
export class OptionOther {
  @Input() nodeType!: NodeType;
  OptionOtherText = OPTION_OTHER_TEXT;
  // FieldType = FieldType;
  NodeType = NodeType;
}
