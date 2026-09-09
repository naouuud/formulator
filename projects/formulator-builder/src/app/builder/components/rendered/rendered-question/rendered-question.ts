import { Component, input } from '@angular/core';
import { isOptionsQuestion, QuestionElement } from '@formulator/schema';

@Component({
  selector: 'app-rendered-question',
  imports: [],
  templateUrl: './rendered-question.html',
})
export class RenderedQuestion {
  readonly questionElement = input.required<QuestionElement>();
  protected readonly isOptionsQuestion = isOptionsQuestion;
}
