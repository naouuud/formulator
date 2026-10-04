import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
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

/** Gap between picker panel and viewport edge (and anchor button). */
const TYPE_PICKER_VIEWPORT_MARGIN_PX = 16;
const TYPE_PICKER_GAP_PX = 6;
const TYPE_PICKER_MAX_HEIGHT_PX = 256;
/** Prefer opening upward when less than this space remains below the button. */
const TYPE_PICKER_FLIP_THRESHOLD_PX = 180;

@Component({
  selector: 'app-page-canvas',
  imports: [QuestionEditor, NoteEditor],
  templateUrl: './page-canvas.html',
})
export class PageCanvas {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  private readonly injector = inject(Injector);
  private readonly typePickerHost = viewChild<ElementRef<HTMLElement>>('typePickerHost');
  protected readonly showTypePicker = signal(false);
  protected readonly typePickerOpensAbove = signal(false);
  protected readonly typePickerMaxHeightPx = signal(TYPE_PICKER_MAX_HEIGHT_PX);
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
      this.setActivePage(this.domainStore.activeSpread()!.schema.pages.length - 1);
    }
  }

  protected deletePage(id: string): void {
    this.domainStore.deletePage(id);
    const pageCount = this.domainStore.activeSpread()?.schema.pages.length ?? 0;
    const updatedPageIdx = Math.min(this.domainStore.activePageIdx(), pageCount - 1);
    this.setActivePage(updatedPageIdx);
  }

  protected selectElement(id: string): void {
    if (this.uiStore.selectedElementId() === id) this.uiStore.clearSelectedElementId();
    else this.uiStore.setSelectedElementId(id);
  }

  protected toggleTypePicker(event: Event): void {
    event.stopPropagation();
    if (this.showTypePicker()) {
      this.closeTypePicker();
      return;
    }
    this.showTypePicker.set(true);
    afterNextRender(() => this.layoutTypePicker(), { injector: this.injector });
  }

  @HostListener('document:click', ['$event'])
  protected closeTypePickerOnOutsideClick(event: MouseEvent): void {
    if (!this.showTypePicker()) return;
    const host = this.typePickerHost()?.nativeElement;
    if (host && !host.contains(event.target as Node)) {
      this.closeTypePicker();
    }
  }

  @HostListener('document:keydown.escape')
  protected closeTypePickerOnEscape(): void {
    this.closeTypePicker();
  }

  protected closeTypePicker(): void {
    this.showTypePicker.set(false);
    this.typePickerOpensAbove.set(false);
  }

  private layoutTypePicker(): void {
    if (!this.showTypePicker()) return;

    const host = this.typePickerHost()?.nativeElement;
    const button = host?.querySelector('button');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const margin = TYPE_PICKER_VIEWPORT_MARGIN_PX;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openAbove = spaceBelow < TYPE_PICKER_FLIP_THRESHOLD_PX && spaceAbove > spaceBelow;

    this.typePickerOpensAbove.set(openAbove);
    const available = Math.max(0, (openAbove ? spaceAbove : spaceBelow) - TYPE_PICKER_GAP_PX);
    this.typePickerMaxHeightPx.set(Math.min(TYPE_PICKER_MAX_HEIGHT_PX, available));
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
