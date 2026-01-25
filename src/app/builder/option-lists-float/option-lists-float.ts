import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Option } from '../../models/field-types';

@Component({
  selector: 'app-option-lists-float',
  templateUrl: './option-lists-float.html',
  styleUrl: './option-lists-float.css',
})
export class OptionListsFloat {
  @Input() optionLists!: Option[][];
  @Output() optionListEM = new EventEmitter<Option[]>();

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.emitClose();
    }
  }

  constructor(private el: ElementRef) {}

  emitOptionList(optionList: Option[]) {
    this.optionListEM.emit(optionList);
  }

  emitClose() {
    this.optionListEM.emit(null as any);
  }
}
