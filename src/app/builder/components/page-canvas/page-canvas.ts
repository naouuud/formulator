import { Component, computed, effect, inject, signal } from '@angular/core';
import { HTMLType } from '../../../../domain/model/question';
import { DomainStore } from '../../../../domain/store/domain-store';
import { NoteEditor } from '../note-editor/note-editor';
import { QuestionEditor } from '../question-editor/question-editor';

export type QuestionTypeOption = {
  htmlType: HTMLType;
  label: string;
  description: string;
};

const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  { htmlType: 'text', label: 'Text', description: 'Free-form text answer' },
  { htmlType: 'select', label: 'Select', description: 'Dropdown with one choice' },
  { htmlType: 'radio', label: 'Radio', description: 'Radio buttons, one choice' },
];

@Component({
  selector: 'app-page-canvas',
  imports: [QuestionEditor, NoteEditor],
  templateUrl: './page-canvas.html',
})
export class PageCanvas {
  protected readonly domainStore = inject(DomainStore);
  protected readonly selectedElementId = signal<string | null>(null);
  protected readonly showTypePicker = signal(false);
  protected readonly questionTypeOptions = QUESTION_TYPE_OPTIONS;
  private readonly activeSpreadId = computed(() => this.domainStore.activeSpread()?.id);

  protected readonly selectedElement = computed(() => {
    const id = this.selectedElementId();
    if (!id) return null;
    return this.domainStore.activePage()?.elements.find((e) => e.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      this.activeSpreadId();
      this.selectedElementId.set(null);
    });
  }

  protected setActivePage(idx: number): void {
    this.selectedElementId.set(null);
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
    this.selectedElementId.update((current) => (current === id ? null : id));
  }

  protected toggleTypePicker(): void {
    this.showTypePicker.update((v) => !v);
  }

  protected addQuestionOfType(htmlType: HTMLType): void {
    this.showTypePicker.set(false);
    this.domainStore.addElement({ elementType: 'question', htmlType });
    this.selectLastElement();
  }

  protected closeTypePicker(): void {
    this.showTypePicker.set(false);
  }

  protected addNote(): void {
    this.domainStore.addElement({ elementType: 'note' });
    this.selectLastElement();
  }

  private selectLastElement(): void {
    const elements = this.domainStore.activePage()?.elements;
    if (elements?.length) {
      this.selectedElementId.set(elements[elements.length - 1].id);
    }
  }
}
