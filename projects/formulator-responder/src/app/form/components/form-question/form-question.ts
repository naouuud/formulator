import { Component, computed, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { isOptionsQuestion, QuestionElement } from '@formulator/schema';
import { FormService } from '../../form.service';

@Component({
  selector: 'form-question',
  imports: [FormField],
  templateUrl: './form-question.html',
})
export class FormQuestion {
  readonly pageId = input.required<string>();
  readonly questionElement = input.required<QuestionElement>();
  protected readonly formService = inject(FormService);
  protected readonly isOptionsQuestion = isOptionsQuestion;
  protected readonly fieldState = computed(() =>
    this.formService.getFieldState(this.pageId(), this.questionElement().id),
  );
}
