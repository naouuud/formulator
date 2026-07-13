import { Component, input } from '@angular/core';
import { QuestionElement } from '../../../../../domain/model/element';
import { isOptionsQuestion } from '../../../../../domain/model/question';

@Component({
  selector: 'app-rendered-question',
  imports: [],
  templateUrl: './rendered-question.html',
})
export class RenderedQuestion {
  readonly questionElement = input.required<QuestionElement>();
  protected readonly isOptionsQuestion = isOptionsQuestion;
}
