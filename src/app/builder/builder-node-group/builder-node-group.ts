import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { Node } from '../../models/node-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { BuilderNode } from '../builder-node/builder-node';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder-service';
import { FactoryType } from '../../models/factory-types';

@Component({
  selector: 'app-builder-node-group',
  imports: [
    BuilderPropLabel,
    BuilderValidation,
    forwardRef(() => BuilderNode),
    ReactiveFormsModule,
    CdkDrag,
    CdkDropList,
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
    this.builderService.reorderNode_S(this.node.nodes, event.previousIndex, event.currentIndex);
  }

  #addNode_C(event: CdkDragDrop<FactoryType>) {
    const factoryType: FactoryType = event.item.data;
    this.builderService.addChildNode_S(this.node.nodes, factoryType);
    this.builderService.reorderNode_S(
      this.node.nodes,
      this.node.nodes.length - 1,
      event.currentIndex,
    );
  }
}
