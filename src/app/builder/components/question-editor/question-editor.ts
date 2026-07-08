import { Component, computed, inject, input } from '@angular/core';
import { QuestionElement } from '../../../../domain/model/element';
import { DomainStore } from '../../../../domain/store/domain-store';
import { OptionsPanel } from '../options-panel/options-panel';
import { isOptionsQuestion } from '../../../../domain/model/question';

@Component({
  selector: 'app-question-editor',
  imports: [OptionsPanel],
  templateUrl: './question-editor.html',
})
export class QuestionEditor {
  readonly element = input.required<QuestionElement>();
  protected readonly domainStore = inject(DomainStore);
  protected readonly labelValue = computed(() => String(this.element().el.label));
  protected readonly requiredValue = computed(() => this.element().el.validators.required);
  protected readonly isOptionsQuestion = isOptionsQuestion;

  protected onLabelInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.domainStore.updateQuestionLabel(this.element().id, value);
  }

  protected toggleRequired(): void {
    this.domainStore.setValidatorRequired(this.element().id, !this.requiredValue());
  }
}
