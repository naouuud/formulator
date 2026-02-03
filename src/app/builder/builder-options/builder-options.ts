import { Component, computed, effect, Input, OnInit, signal } from '@angular/core';
import { Field, FieldType, OPTION_OTHER_TEXT } from '../../models/field-types';
import { BuilderService } from '../../services/builder-service';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { CustomRadio } from '../custom-radio/custom-radio';
import { CustomCheckbox } from '../custom-checkbox/custom-checkbox';
import { PropType } from '../../models/prop-types';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { OptionOther } from '../option-other/option-other';
import { Node, NodeType, DuplicateOptionError, EmptyOptionError } from '../../models/node';
// import { CustomSelect } from '../custom-select/custom-select';

@Component({
  selector: 'app-builder-options',
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    CustomRadio,
    CustomCheckbox,
    ReactiveFormsModule,
    OptionOther,
    // CustomSelect,
  ],
  templateUrl: './builder-options.html',
  styleUrl: './builder-options.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderOptions implements OnInit {
  // FieldType = FieldType;
  NodeType = NodeType;
  @Input() node!: Node;
  dragDisabled$;
  optionOtherProp = false;
  optionOtherValue = false; // fallback value
  OptionOtherText = OPTION_OTHER_TEXT;
  PropType = PropType;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  ngOnInit(): void {
    this.optionOtherProp = !!this.node.getProp(PropType.OPTIONOTHER);
    if (this.optionOtherProp) {
      // initialize from field
      this.optionOtherValue = this.node.getPropValue(PropType.OPTIONOTHER)!;
    }
  }

  updateOptionOtherValue(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.optionOtherValue = value;
  }

  addOption_C(optionInput: HTMLInputElement) {
    const option = optionInput.value;
    try {
      this.builderService.addOption_S(this.node, option);
      optionInput.value = '';
    } catch (err) {
      if (err instanceof DuplicateOptionError) {
        console.warn(err.message);
      }
      if (err instanceof EmptyOptionError) {
        console.warn(err.message);
      }
    }
  }

  reorderOption_C(event: CdkDragDrop<unknown>) {
    this.builderService.reorderOption_S(this.node, event.previousIndex, event.currentIndex);
  }

  deleteOption_C(idx: number) {
    this.builderService.deleteOption_S(this.node, idx);
  }
}
