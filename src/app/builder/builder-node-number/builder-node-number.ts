import { Component, Input } from '@angular/core';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { Node } from '../../models/node-types';

@Component({
  selector: 'app-builder-node-number',
  imports: [BuilderPropLabel, BuilderValidation],
  templateUrl: './builder-node-number.html',
  styleUrl: './builder-node-number.css',
})
export class BuilderNodeNumber {
  @Input() node!: Node;
}
