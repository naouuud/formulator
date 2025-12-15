import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType, NameGroup } from '../models/json-types';
import { checkers } from '../models/typecheck-functions';

@Component({
  selector: 'app-renderer-name',
  imports: [],
  templateUrl: './renderer-name.html',
  styleUrl: './renderer-name.css',
})
export class RendererName {
  FieldType = FieldType;
  isTextField = checkers.isTextField;
  @Input() group!: NameGroup;
  @Input() formGroupIn!: FormGroup;
}
