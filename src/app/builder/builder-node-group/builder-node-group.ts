import { Component, forwardRef, Input } from '@angular/core';
import { Node } from '../../models/node-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { BuilderNode } from '../builder-node/builder-node';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-builder-node-group',
  imports: [
    BuilderPropLabel,
    BuilderValidation,
    forwardRef(() => BuilderNode),
    ReactiveFormsModule,
  ],
  templateUrl: './builder-node-group.html',
  styleUrl: './builder-node-group.css',
})
export class BuilderNodeGroup {
  @Input() node!: Node;
  @Input() allFormGroupsIn!: FormGroup;

  getFormGroup(nodeId: string): FormGroup {
    return this.allFormGroupsIn.get(nodeId) as FormGroup;
  }
}
