import { Component, effect, signal } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { BuilderFormTitle } from '../builder-form-title/builder-form-title';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Prop, PropType } from '../../models/prop-types';
import { LABEL_MAX_LENGTH } from '../../models/field-types';
import { BuilderNode } from '../builder-node/builder-node';
import { NodeType, Node } from '../../models/node-types';
import { FactoryType } from '../../models/factory-types';

@Component({
  selector: 'app-builder-form',
  imports: [DragDropModule, CdkDropList, BuilderFormTitle, BuilderNode, ReactiveFormsModule],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel$;
  dragDisabled$;
  hideMessage;
  allFormGroups;
  PropType = PropType;
  NodeType = NodeType;

  constructor(private builderService: BuilderService) {
    this.formModel$ = this.builderService.formModel$;
    this.dragDisabled$ = this.builderService.dragDisabled$;
    this.allFormGroups = new FormGroup({});
    this.hideMessage = signal(false);
    effect(() => {
      const formModel = this.formModel$(); // only set once in service
      const nodeList = Node.flat(...formModel.nodes);
      for (let node of nodeList) {
        this.#addFormGroup(node);
      }
      console.log(this.allFormGroups);
    });
  }

  onDrop(event: CdkDragDrop<FactoryType>) {
    if (event.previousContainer === event.container) {
      this.#reorderNode_C(event);
    } else {
      this.#addNode_C(event);
    }
  }

  #reorderNode_C(event: CdkDragDrop<FactoryType>) {
    this.builderService.reorderNode_S(
      this.formModel$().nodes,
      event.previousIndex,
      event.currentIndex,
    );
  }

  #addNode_C(event: CdkDragDrop<FactoryType>) {
    const factoryType: FactoryType = event.item.data; // extract FactoryType from drag data
    const node = this.builderService.addNode_S(this.formModel$().nodes, factoryType); // add & return Node ref
    this.builderService.reorderNode_S(
      this.formModel$().nodes,
      this.formModel$().nodes.length - 1,
      event.currentIndex,
    );
    const flatNodeList = Node.flat(node); // flatten node to add all necessary form groups
    for (let node of flatNodeList) {
      this.#addFormGroup(node);
    }
    console.log(this.allFormGroups);
  }

  nodeDeleteCleanup(nodeIdsForDelete: string[]) {
    this.hideMessage.set(this.formModel$().nodes.length > 0); // show empty message if no nodes left
    nodeIdsForDelete.forEach((nodeId) => this.allFormGroups.removeControl(nodeId));
    console.log(this.allFormGroups);
  }

  submitForm(): void {
    if (this.allFormGroups.valid) {
      // proceed
    } else {
      this.builderService.showAllErrorMessages$.set(true);
      setTimeout(() => {
        this.builderService.showAllErrorMessages$.set(false);
      }, 8_000);
    }
  }

  // to bypass typing (allFormGroupsIn.get returns AbstractControl)
  getFormGroup(nodeId: string): FormGroup {
    return this.allFormGroups.get(nodeId) as FormGroup;
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
      this.allFormGroups.addControl(node.nodeId, nodeFormGroup); // FormGroup identifier = nodeId
    });
    // console.log(this.allFormGroups);
  }
}
