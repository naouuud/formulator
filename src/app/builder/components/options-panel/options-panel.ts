import { Component, computed, HostListener, inject, input, signal } from '@angular/core';
import { QuestionElement } from '../../../../domain/model/element';
import { Option } from '../../../../domain/model/option';
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
  protected readonly editingOptionId = signal<string | null>(null);
  protected readonly editLabelValue = signal('');

  protected setLabelValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.labelValue.set(value);
  }

  protected setEditLabelValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editLabelValue.set(value);
  }

  protected startEdit(option: Option, event: Event): void {
    event.stopPropagation();
    this.editingOptionId.set(option.id);
    this.editLabelValue.set(option.label);
  }

  protected saveEdit(): void {
    const optionId = this.editingOptionId();
    const label = this.editLabelValue().trim();
    if (!optionId || !label) return;

    this.domainStore.editOption(this.element().id, optionId, label, label);
    this.cancelEdit();
  }

  protected cancelEdit(): void {
    this.editingOptionId.set(null);
    this.editLabelValue.set('');
  }

  protected addOption(): void {
    const value = this.labelValue();
    this.domainStore.addOption(this.element().id, value, value);
    this.labelValue.set('');
  }

  protected deleteOption(optionId: string, event: Event): void {
    event.stopPropagation();
    if (this.editingOptionId() === optionId) {
      this.cancelEdit();
    }
    this.domainStore.deleteOption(this.element().id, optionId);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.editingOptionId()) {
      this.cancelEdit();
    }
  }
}
