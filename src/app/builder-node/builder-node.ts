import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Node, NodeType } from '../models/node-types';
import { Option, PropChangeEvent, PropType } from '../models/prop-types';
import { BuilderFieldText } from '../builder/builder-field-text/builder-field-text';
import { BuilderService } from '../services/builder-service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BuilderFieldTextarea } from '../builder/builder-field-textarea/builder-field-textarea';
import { BuilderFieldSelect } from '../builder/builder-field-select/builder-field-select';
import { BuilderFieldNumber } from '../builder-field-number/builder-field-number';
import { BuilderFieldOption } from '../builder/builder-field-option/builder-field-option';
import { BuilderFieldDate } from '../builder/builder-field-date/builder-field-date';
import { BuilderGroupDelete } from '../builder/builder-group-delete/builder-group-delete';
import { OptionListsFloat } from '../builder/option-lists-float/option-lists-float';
import { BuilderNodeEmail } from '../builder-node-email/builder-node-email';
import { BuilderNodePhone } from '../builder-node-phone/builder-node-phone';
import { BuilderNodeGroup } from '../builder-node-group/builder-node-group';

const NodeLabels = {
  [NodeType.NONE]: 'none',
  [NodeType.TEXT]: 'short text',
  [NodeType.TEXTAREA]: 'long text (e.g. comment, essay)',
  [NodeType.NUMBER]: 'number',
  [NodeType.SELECT]: 'dropdown',
  [NodeType.CHECKBOX]: 'multiple selection',
  [NodeType.RADIO]: 'single selection',
  [NodeType.DATE]: 'date',
  [NodeType.GROUP]: 'group',
  [NodeType.EMAIL]: 'email',
  [NodeType.PHONE]: 'phone',
};

@Component({
  selector: 'app-builder-node',
  imports: [
    BuilderFieldText,
    BuilderFieldTextarea,
    BuilderFieldSelect,
    BuilderFieldNumber,
    BuilderFieldOption,
    BuilderFieldDate,
    CdkDrag,
    ReactiveFormsModule,
    BuilderGroupDelete,
    OptionListsFloat,
    BuilderNodeEmail,
    BuilderNodePhone,
    BuilderNodeGroup,
  ],
  templateUrl: './builder-node.html',
  styleUrl: './builder-node.css',
})
export class BuilderNode implements OnInit {
  NodeType = NodeType;
  PropType = PropType;
  @Input() formGroupIn!: FormGroup;
  @Input() node!: Node;
  @Output() nodeDeletedEM = new EventEmitter<string>();
  dragDisabled$;
  floatVisible = false;
  NodeLabels = NodeLabels;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  ngOnInit(): void {
    const labelControl = this.formGroupIn.get('label');
    labelControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.LABEL, value });
    });
    const requiredControl = this.formGroupIn.get('required');
    requiredControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.REQUIRED, value });
    });
    const maxLengthCharControl = this.formGroupIn.get('maxlengthchar');
    maxLengthCharControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.MAXLENGTHCHAR, value: Number(value) });
    });
    const maxLengthWordControl = this.formGroupIn.get('maxlengthword');
    maxLengthWordControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.MAXLENGTHWORD, value: Number(value) });
    });
    const optionOtherControl = this.formGroupIn.get('optionother');
    optionOtherControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.OPTIONOTHER, value });
    });
  }

  setProp_C(propChangeEvent: PropChangeEvent) {
    const { propType, value } = propChangeEvent;
    this.builderService.setProp_S(this.node, propType, value);
  }

  toggleRadioCheckbox_C(): void {
    this.builderService.toggleRadioCheckbox_S(this.node);
  }

  deleteNode_C(): void {
    this.builderService.deleteNode_S(this.node.nodeId);
    this.nodeDeletedEM.emit(this.node.nodeId); // emit to delete formcontrols
  }

  replaceOptions_C(optionList: Option[] | null) {
    if (optionList) this.builderService.replaceOptions_S(this.node, optionList);
    this.floatVisible = false;
  }

  getOptionLists_C(): Option[][] {
    return this.builderService.getOptionLists_S();
  }
}
