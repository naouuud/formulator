import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TextareaField } from '../../models/json-types';

@Component({
  selector: 'app-renderer-textarea',
  imports: [],
  templateUrl: './renderer-textarea.html',
  styleUrl: './renderer-textarea.css',
})
export class RendererTextarea {
  @Input() field!: TextareaField;
  @Input() formGroupIn!: FormGroup;

  currentLength = 0;

  updateCount(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.currentLength = target.value.length;
  }
}
