import { Component, Input } from '@angular/core';
import { Node } from '../models/node-types';
import { BuilderPropLabel } from '../builder/builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder/builder-validation/builder-validation';
import { BuilderNodeChild } from '../builder-node-child/builder-node-child';

@Component({
  selector: 'app-builder-node-group',
  imports: [BuilderPropLabel, BuilderValidation, BuilderNodeChild],
  templateUrl: './builder-node-group.html',
  styleUrl: './builder-node-group.css',
})
export class BuilderNodeGroup {
  @Input() node!: Node;
}
