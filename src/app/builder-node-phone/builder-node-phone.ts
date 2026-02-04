import { Component, Input } from '@angular/core';
import { BuilderPropLabel } from '../builder/builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder/builder-validation/builder-validation';
import { Node } from '../models/node-types';

@Component({
  selector: 'app-builder-node-phone',
  imports: [BuilderPropLabel, BuilderValidation],
  templateUrl: './builder-node-phone.html',
  styleUrl: './builder-node-phone.css',
})
export class BuilderNodePhone {
  @Input() node!: Node;
}
