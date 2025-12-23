import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldType, NameGroup } from '../../models/json-types';
import { checkers } from '../../models/typecheck-functions';

@Component({
  selector: 'app-renderer-name-group',
  imports: [ReactiveFormsModule],
  templateUrl: './renderer-name-group.html',
  styleUrl: './renderer-name-group.css',
})
export class RendererNameGroup {
  FieldType = FieldType;
  isTextField = checkers.isTextField;
  @Input() group!: NameGroup;
  @Input() formGroupIn!: FormGroup;
}
