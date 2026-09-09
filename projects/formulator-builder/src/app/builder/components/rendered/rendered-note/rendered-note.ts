import { Component, input } from '@angular/core';
import { NoteElement } from '@formulator/schema';

@Component({
  selector: 'app-rendered-note',
  imports: [],
  templateUrl: './rendered-note.html',
})
export class RenderedNote {
  readonly noteElement = input.required<NoteElement>();
}
