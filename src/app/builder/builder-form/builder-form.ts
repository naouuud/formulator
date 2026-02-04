import { Component, effect, signal } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { BuilderGroup } from '../builder-group/builder-group';
import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
// import { GroupType } from '../../models/group-types';
import { BuilderFormTitle } from '../builder-form-title/builder-form-title';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Prop, PropType } from '../../models/prop-types';
import { LABEL_MAX_LENGTH } from '../../models/field-types';
import { BuilderNode } from '../../builder-node/builder-node';
import { NodeType, Node } from '../../models/node-types';
import { FactoryType } from '../../models/factory-types';

@Component({
  selector: 'app-builder-form',
  imports: [DragDropModule, CdkDropList, BuilderFormTitle, BuilderNode],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel$;
  hideMessage;
  allFormGroups;
  PropType = PropType;
  NodeType = NodeType;

  constructor(private builderService: BuilderService) {
    this.formModel$ = this.builderService.formModel$;
    this.allFormGroups = new FormGroup({});
    this.hideMessage = signal(false);
    effect(() => {
      const formModel = this.formModel$(); // only set once in service
      this.#addFormGroup(formModel.getNodes());
    });
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      this.#reorderNode_C(event);
    } else {
      this.#addNode_C(event);
    }
  }

  // private _reorderGroup_C(event: CdkDragDrop<unknown>) {
  //   this.builderService.reorderGroup_S(event.previousIndex, event.currentIndex);
  // }

  #reorderNode_C(event: CdkDragDrop<unknown>) {
    this.builderService.reorderNode_S(event.previousIndex, event.currentIndex);
  }

  #addNode_C(event: CdkDragDrop<FactoryType>) {
    const factoryType: FactoryType = event.item.data;
    const nodes = this.builderService.addNode_S(factoryType); // return &Node
    this.builderService.reorderNode_S(this.formModel$().nodes.length - 1, event.currentIndex);
    this.#addFormGroup(nodes);
  }

  nodeDeleteCleanup(nodeId: string) {
    this.hideMessage.set(this.formModel$().nodes.length > 0); // set empty message on if no groups left
    this.allFormGroups.removeControl(nodeId); // delete control
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

  #addFormGroup(nodes: Node[]): void {
    nodes.forEach((n) => {
      const nodeFormGroup = new FormGroup({});
      n.props.forEach((prop: Prop) => {
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
        this.allFormGroups.addControl(n.nodeId, nodeFormGroup); // FormGroup identifier = nodeId
      });
    });
    // console.log(this.allFormGroups);
  }
}
