import { Component, input } from '@angular/core';
import { NoteElement } from '../../../../../domain/model/element';

@Component({
  selector: 'app-rendered-note',
  imports: [],
  templateUrl: './rendered-note.html',
})
export class RenderedNote {
  readonly noteElement = input.required<NoteElement>();
}
