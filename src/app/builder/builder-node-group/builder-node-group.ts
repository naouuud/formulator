import { Component, EventEmitter, Inject, Input, OnInit, Output, signal } from '@angular/core';
import { LABEL_MAX_LENGTH, Node } from '../../models/node-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { FormRepoLocal } from '../../services/form-repo-local';
import { FactoryType } from '../../models/factory-types';
import { BuilderNodeChild } from '../builder-node-child/builder-node-child';
import { Prop, PropType } from '../../models/prop-types';
import { FORM_REPO } from '../../app.config';
import { IFormRepo } from '../../services/form-repo';

@Component({
  selector: 'app-builder-node-group',
  imports: [
    BuilderPropLabel,
    // BuilderValidation,
    ReactiveFormsModule,
    CdkDropList,
    BuilderNodeChild,
  ],
  templateUrl: './builder-node-group.html',
  styleUrl: './builder-node-group.css',
})
export class BuilderNodeGroup implements OnInit {
  @Input() node!: Node;
  @Input() allFormGroupsIn!: FormGroup;
  @Output() nodeDeletedEM_G = new EventEmitter<string[]>();
  hideEmptyMessage$;

  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {
    this.hideEmptyMessage$ = signal(true);
  }

  ngOnInit(): void {
    this.hideEmptyMessage$.set(!!this.node.nodes.length);
  }

  childNodeDeleteCleanup(event: string[]) {
    setTimeout(() => this.hideEmptyMessage$.set(!!this.node.nodes.length), 250); // show empty message if no nodes left
    this.nodeDeletedEM_G.emit(event);
  }

  getFormGroup(nodeId: string): FormGroup {
    return this.allFormGroupsIn.get(nodeId) as FormGroup;
  }

  onDrop(event: CdkDragDrop<FactoryType>) {
    // console.log(event.container.id);
    if (event.previousContainer === event.container) {
      this.#reorderNode_C(event);
    } else {
      this.#addNode_C(event);
    }
  }

  #reorderNode_C(event: CdkDragDrop<FactoryType>) {
    // console.log(event);
    this.formRepo.reorderNode_S(this.node.nodes, event.previousIndex, event.currentIndex);
  }

  #addNode_C(event: CdkDragDrop<FactoryType>) {
    const factoryType: FactoryType = event.item.data;
    const newNode = this.formRepo.addNode_S(this.node.nodes, factoryType);
    this.formRepo.reorderNode_S(this.node.nodes, this.node.nodes.length - 1, event.currentIndex);
    const flatNodeList = Node.flat(newNode); // flatten node to add all necessary form groups
    for (let node of flatNodeList) {
      this.#addFormGroup(node);
    }
    // console.log(this.allFormGroupsIn);
  }

  #addFormGroup(node: Node): void {
    const nodeFormGroup = new FormGroup({});
    node.props.forEach((prop: Prop) => {
      const validators: ValidatorFn[] = [];
      switch (prop.propType) {
        case PropType.LABEL:
          validators.push(Validators.required, Validators.maxLength(LABEL_MAX_LENGTH));
          break;
        // Props set thru form based reactivity (no validators):
        //   LABEL = 'label',
        //   MAXLENGTHCHAR = 'maxlengthchar',
        //   MAXLENGTHWORD = 'maxlengthword',
        //   REQUIRED = 'required',
        //   OPTIONOTHER = 'optionother',
        // Non-editable Props (no controls)
        case PropType.PLACEHOLDER:
        case PropType.PATTERNNUMBER:
        case PropType.PATTERNPHONE:
        case PropType.OPTIONS:
        case PropType.DATERANGE:
        case PropType.EMAIL:
          return;
      }
      const control = new FormControl(prop.value, { nonNullable: true, validators });
      if (!prop.editable) control.disable();
      nodeFormGroup.addControl(prop.propType, control); // FormControl identifier = propType
      this.allFormGroupsIn.addControl(node.nodeId, nodeFormGroup); // FormGroup identifier = nodeId
    });
    // console.log(this.allFormGroups);
  }
}
