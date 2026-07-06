import { Component, computed, effect, inject, signal } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { NoteEditor } from '../note-editor/note-editor';
import { QuestionEditor } from '../question-editor/question-editor';

@Component({
  selector: 'app-page-canvas',
  imports: [QuestionEditor, NoteEditor],
  templateUrl: './page-canvas.html',
})
export class PageCanvas {
  protected readonly domainStore = inject(DomainStore);
  protected readonly selectedElementId = signal<string | null>(null);
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

  protected selectElement(id: string): void {
    this.selectedElementId.update((current) => (current === id ? null : id));
  }

  protected addQuestion(): void {
    this.domainStore.addElement({ elementType: 'question', htmlType: 'text' });
  }

  protected addNote(): void {
    this.domainStore.addElement({ elementType: 'note' });
  }
}
