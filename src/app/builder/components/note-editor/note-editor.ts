import { Component, computed, inject, input } from '@angular/core';
import { NoteElement } from '@formulator/schema';
import { DomainStore } from '../../../../domain/store/domain-store';

@Component({
  selector: 'app-note-editor',
  imports: [],
  templateUrl: './note-editor.html',
})
export class NoteEditor {
  readonly element = input.required<NoteElement>();

  protected readonly domainStore = inject(DomainStore);

  protected readonly noteValue = computed(() => String(this.element().el.value));

  protected onValueInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.domainStore.updateNoteValue(this.element().id, value);
  }
}
