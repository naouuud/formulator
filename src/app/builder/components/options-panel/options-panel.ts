import { Component, computed, inject, input, signal } from '@angular/core';
import { QuestionElement } from '../../../../domain/model/element';
import { isOptionsQuestion } from '../../../../domain/model/question';
import { DomainStore } from '../../../../domain/store/domain-store';

@Component({
  selector: 'app-options-panel',
  imports: [],
  templateUrl: './options-panel.html',
})
export class OptionsPanel {
  readonly element = input.required<QuestionElement>();
  protected readonly domainStore = inject(DomainStore);
  protected readonly options = computed(() => {
    const el = this.element().el;
    if (!isOptionsQuestion(el)) return [];
    return el.options;
  });
  protected readonly labelValue = signal('');

  protected setLabelValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.labelValue.set(value);
  }

  protected addOption(): void {
    const value = this.labelValue();
    this.domainStore.addOption(this.element().id, value, value);
    this.labelValue.set('');
  }

  protected deleteOption(optionId: string): void {
    this.domainStore.deleteOption(this.element().id, optionId);
  }
}
