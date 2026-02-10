import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Node, NodeType } from '../../models/node-types';
import { PropType, PropChangeEvent, Option } from '../../models/prop-types';
import { BuilderService } from '../../services/builder-service';
import { OptionListsFloat } from '../option-lists-float/option-lists-float';
import { BuilderDeleteButton } from '../builder-delete-button/builder-delete-button';
import { BuilderNodeText } from '../builder-node-text/builder-node-text';
import { BuilderNodeTextarea } from '../builder-node-textarea/builder-node-textarea';
import { BuilderNodeNumber } from '../builder-node-number/builder-node-number';
import { BuilderNodeSelect } from '../builder-node-select/builder-node-select';
import { BuilderNodeOption } from '../builder-node-option/builder-node-option';
import { BuilderNodeDate } from '../builder-node-date/builder-node-date';
import { BuilderNodeEmail } from '../builder-node-email/builder-node-email';
import { BuilderNodePhone } from '../builder-node-phone/builder-node-phone';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
  selector: 'app-builder-node-child',
  imports: [
    OptionListsFloat,
    BuilderDeleteButton,
    BuilderNodeText,
    BuilderNodeTextarea,
    BuilderNodeNumber,
    BuilderNodeSelect,
    BuilderNodeOption,
    BuilderNodeDate,
    BuilderNodeEmail,
    BuilderNodePhone,
    DragDropModule,
  ],
  templateUrl: './builder-node-child.html',
  styleUrl: './builder-node-child.css',
})
export class BuilderNodeChild {
  NodeType = NodeType;
  PropType = PropType;
  NodeLabels = NodeLabels;

  @Input() node!: Node;
  @Input() nodeList!: Node[]; // parent list ref for delete
  @Input() nodeFormGroup!: FormGroup; // this node's form control
  @Input() allFormGroupsIn!: FormGroup; // to pass to group node (for children)
  @Output() nodeDeletedEM_N = new EventEmitter<string[]>();

  dragDisabled$;
  floatVisible = false;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  ngOnInit(): void {
    const labelControl = this.nodeFormGroup.get('label');
    labelControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.LABEL, value });
    });
    const requiredControl = this.nodeFormGroup.get('required');
    requiredControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.REQUIRED, value });
    });
    const maxLengthCharControl = this.nodeFormGroup.get('maxlengthchar');
    maxLengthCharControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.MAXLENGTHCHAR, value: Number(value) });
    });
    const maxLengthWordControl = this.nodeFormGroup.get('maxlengthword');
    maxLengthWordControl?.valueChanges.subscribe((value: unknown) => {
      this.setProp_C({ propType: PropType.MAXLENGTHWORD, value: Number(value) });
    });
    const optionOtherControl = this.nodeFormGroup.get('optionother');
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
    this.builderService.deleteNode_S(this.nodeList, this.node.nodeId);
    const nodeIdsForDelete = Node.flat(this.node).map((n) => n.nodeId);
    this.nodeDeletedEM_N.emit(nodeIdsForDelete); // emit to delete formcontrols
  }

  replaceOptions_C(optionList: Option[] | null) {
    if (optionList) this.builderService.replaceOptions_S(this.node, optionList);
    this.floatVisible = false;
  }

  getOptionLists_C(): Option[][] {
    return this.builderService.getOptionLists_S();
  }
}
