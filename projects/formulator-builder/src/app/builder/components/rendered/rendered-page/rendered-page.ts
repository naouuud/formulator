import { Component, input } from '@angular/core';
import { Page } from '@formulator/schema';
import { RenderedQuestion } from '../rendered-question/rendered-question';
import { RenderedNote } from '../rendered-note/rendered-note';

@Component({
  selector: 'app-rendered-page',
  imports: [RenderedQuestion, RenderedNote],
  templateUrl: './rendered-page.html',
})
export class RenderedPage {
  readonly page = input.required<Page>();
}
