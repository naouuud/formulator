import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Node, NodeType } from '../../models/node-types';
import { Option, PropChangeEvent, PropType } from '../../models/prop-types';
import { BuilderNodeText } from '../builder-node-text/builder-node-text';
import { FormRepoLocal } from '../../services/form-repo-local';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BuilderNodeTextarea } from '../builder-node-textarea/builder-node-textarea';
import { BuilderNodeSelect } from '../builder-node-select/builder-node-select';
import { BuilderNodeNumber } from '../builder-node-number/builder-node-number';
import { BuilderNodeOption } from '../builder-node-option/builder-node-option';
import { BuilderNodeDate } from '../builder-node-date/builder-node-date';
import { BuilderDeleteButton } from '../builder-delete-button/builder-delete-button';
import { OptionListsFloat } from '../option-lists-float/option-lists-float';
import { BuilderNodeEmail } from '../builder-node-email/builder-node-email';
import { BuilderNodePhone } from '../builder-node-phone/builder-node-phone';
import { BuilderNodeGroup } from '../builder-node-group/builder-node-group';
import { FORM_REPO } from '../../app.config';
import { IFormRepo } from '../../services/form-repo';

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
    BuilderNodeText,
    BuilderNodeTextarea,
    BuilderNodeSelect,
    BuilderNodeNumber,
    BuilderNodeOption,
    BuilderNodeDate,
    CdkDrag,
    ReactiveFormsModule,
    BuilderDeleteButton,
    OptionListsFloat,
    BuilderNodeEmail,
    BuilderNodePhone,
    BuilderNodeGroup,
  ],
  templateUrl: './builder-node.html',
  styleUrl: './builder-node.css',
})
export class BuilderNode implements OnInit, AfterViewInit {
  NodeType = NodeType;
  PropType = PropType;
  NodeLabels = NodeLabels;

  @Input() node!: Node;
  @Input() nodeList!: Node[]; // parent list ref for delete
  @Input() nodeFormGroup!: FormGroup; // this node's form control
  @Input() allFormGroupsIn!: FormGroup; // to pass to group node (for children)
  @Output() nodeDeletedEM_N = new EventEmitter<string[]>();
  @Output() groupElementEM = new EventEmitter<ElementRef<HTMLDivElement>>();
  @ViewChild('groupElement') groupElement!: ElementRef<HTMLDivElement>;

  dragDisabled$;
  floatVisible = false;

  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {
    this.dragDisabled$ = this.formRepo.dragDisabled$;
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

  ngAfterViewInit(): void {
    if (!this.groupElement) return;
    this.groupElementEM.emit(this.groupElement);
  }

  setProp_C(propChangeEvent: PropChangeEvent) {
    const { propType, value } = propChangeEvent;
    this.formRepo.setProp_S(this.node, propType, value);
  }

  toggleRadioCheckbox_C(): void {
    this.formRepo.toggleRadioCheckbox_S(this.node);
  }

  deleteNode_C(): void {
    this.formRepo.deleteNode_S(this.nodeList, this.node.nodeId);
    const nodeIdsForDelete = Node.flat(this.node).map((n) => n.nodeId);
    this.nodeDeletedEM_N.emit(nodeIdsForDelete); // emit to delete formcontrols
  }

  replaceOptions_C(optionList: Option[] | null) {
    if (optionList) this.formRepo.replaceOptions_S(this.node, optionList);
    this.floatVisible = false;
  }

  getOptionLists_C(): Option[][] {
    return this.formRepo.getOptionLists_S();
  }
}
