import { Component, computed, inject, signal } from '@angular/core';
import { HTMLType } from '@formulator/schema';
import { DomainStore } from '../../../../domain/store/domain-store';
import { NoteEditor } from '../note-editor/note-editor';
import { QuestionEditor } from '../question-editor/question-editor';
import { UiStore } from '../../../../ui/store/ui-store';

export type QuestionTypeOption = {
  htmlType: HTMLType;
  label: string;
  description: string;
};

const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  { htmlType: 'text', label: 'Text', description: 'Free-form text answer' },
  { htmlType: 'select', label: 'Select', description: 'Dropdown with one choice' },
  { htmlType: 'radio', label: 'Radio', description: 'Radio buttons, one choice' },
  { htmlType: 'checkbox', label: 'Checkbox', description: 'Checkboxes, multiple choices' },
];

@Component({
  selector: 'app-page-canvas',
  imports: [QuestionEditor, NoteEditor],
  templateUrl: './page-canvas.html',
})
export class PageCanvas {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  protected readonly showTypePicker = signal(false);
  protected readonly questionTypeOptions = QUESTION_TYPE_OPTIONS;
  protected readonly selectedElement = computed(() => {
    const id = this.uiStore.selectedElementId();
    if (!id) return null;
    return this.domainStore.activePage()?.elements.find((e) => e.id === id) ?? null;
  });

  protected setActivePage(idx: number): void {
    this.uiStore.clearSelectedElementId();
    this.domainStore.setActivePage(idx);
  }

  protected addPage(): void {
    this.domainStore.addPage();
    if (this.domainStore.activeSpread()) {
      this.setActivePage(this.domainStore.activeSpread()!.pages.length - 1);
    }
  }

  protected deletePage(id: string): void {
    this.domainStore.deletePage(id);
    const pageCount = this.domainStore.activeSpread()?.pages.length ?? 0;
    const updatedPageIdx = Math.min(this.domainStore.activePageIdx(), pageCount - 1);
    this.setActivePage(updatedPageIdx);
  }

  protected selectElement(id: string): void {
    if (this.uiStore.selectedElementId() === id) this.uiStore.clearSelectedElementId();
    else this.uiStore.setSelectedElementId(id);
  }

  protected toggleTypePicker(): void {
    this.showTypePicker.update((v) => !v);
  }

  protected closeTypePicker(): void {
    this.showTypePicker.set(false);
  }

  protected addQuestionOfType(htmlType: HTMLType): void {
    this.showTypePicker.set(false);
    this.domainStore.addElement({ elementType: 'question', htmlType });
    this.selectLastElement();
  }

  protected addNote(): void {
    this.domainStore.addElement({ elementType: 'note' });
    this.selectLastElement();
  }

  protected deleteElement(elementId: string, event: Event): void {
    event.stopPropagation();
    this.domainStore.deleteElement(elementId);
    if (this.uiStore.selectedElementId() === elementId) this.uiStore.clearSelectedElementId();
  }

  private selectLastElement(): void {
    const elements = this.domainStore.activePage()?.elements;
    if (elements?.length) {
      this.uiStore.setSelectedElementId(elements[elements.length - 1].id);
    }
  }
}
