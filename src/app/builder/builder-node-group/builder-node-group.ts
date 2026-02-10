import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Node } from '../../models/node-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder-service';
import { FactoryType } from '../../models/factory-types';
import { BuilderNodeChild } from '../builder-node-child/builder-node-child';

@Component({
  selector: 'app-builder-node-group',
  imports: [
    BuilderPropLabel,
    BuilderValidation,
    ReactiveFormsModule,
    CdkDropList,
    BuilderNodeChild,
  ],
  templateUrl: './builder-node-group.html',
  styleUrl: './builder-node-group.css',
})
export class BuilderNodeGroup {
  @Input() node!: Node;
  @Input() allFormGroupsIn!: FormGroup;
  @Output() nodeDeletedEM_G = new EventEmitter<string[]>();

  constructor(private builderService: BuilderService) {}

  getFormGroup(nodeId: string): FormGroup {
    return this.allFormGroupsIn.get(nodeId) as FormGroup;
  }

  onDrop(event: CdkDragDrop<FactoryType>) {
    if (event.previousContainer === event.container) {
      this.#reorderNode_C(event);
    } else {
      this.#addNode_C(event);
    }
  }

  #reorderNode_C(event: CdkDragDrop<FactoryType>) {
    // console.log(event);
    this.builderService.reorderNode_S(this.node.nodes, event.previousIndex, event.currentIndex);
  }

  #addNode_C(event: CdkDragDrop<FactoryType>) {
    const factoryType: FactoryType = event.item.data;
    this.builderService.addNode_S(this.node.nodes, factoryType);
    this.builderService.reorderNode_S(
      this.node.nodes,
      this.node.nodes.length - 1,
      event.currentIndex,
    );
  }
}
