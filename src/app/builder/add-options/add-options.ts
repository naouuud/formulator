import { Component, Input } from '@angular/core';
import {
  DuplicateOptionError,
  EmptyOptionError,
  Field,
  FieldType,
  Option,
} from '../../models/field-types';
import { BuilderService } from '../../services/builder-service';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { CustomRadio } from '../../custom-checkbox/custom-radio';
import { CustomCheckbox } from '../../custom-checkbox/custom-checkbox';

@Component({
  selector: 'app-add-options',
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CustomRadio, CustomCheckbox],
  templateUrl: './add-options.html',
  styleUrl: './add-options.css',
})
export class AddOptions {
  FieldType = FieldType;
  @Input() field!: Field;
  dragDisabled$;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  addOption_C(optionInput: HTMLInputElement) {
    const option = optionInput.value;
    try {
      this.builderService.addOption_S(this.field, option);
      optionInput.value = '';
    } catch (err) {
      if (err instanceof DuplicateOptionError) {
        console.warn(err);
      }
      if (err instanceof EmptyOptionError) {
        console.warn(err);
      }
    }
  }

  reorderOption_C(event: CdkDragDrop<unknown>) {
    this.builderService.reorderOption_S(this.field, event.previousIndex, event.currentIndex);
  }

  deleteOption_C(idx: number) {
    this.builderService.deleteOption_S(this.field, idx);
  }
}
