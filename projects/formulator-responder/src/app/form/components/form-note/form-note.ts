import { Component, input } from '@angular/core';
import { NoteElement } from '@formulator/schema';

@Component({
  selector: 'form-note',
  imports: [],
  templateUrl: './form-note.html',
})
export class FormNote {
  readonly noteElement = input.required<NoteElement>();
}
