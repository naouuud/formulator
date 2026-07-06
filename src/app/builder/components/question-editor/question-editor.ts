import { Component, computed, inject, input } from '@angular/core';
import { QuestionElement } from '../../../../domain/model/element';
import { DomainStore } from '../../../../domain/store/domain-store';

@Component({
  selector: 'app-question-editor',
  imports: [],
  templateUrl: './question-editor.html',
})
export class QuestionEditor {
  readonly element = input.required<QuestionElement>();

  protected readonly domainStore = inject(DomainStore);

  protected readonly labelValue = computed(() => String(this.element().el.label));

  protected onLabelInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.domainStore.updateQuestionLabel(this.element().id, value);
  }
}
