import { Component, Input } from '@angular/core';
import { BuilderPropLabel } from '../builder/builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder/builder-validation/builder-validation';
import { Node } from '../models/node-types';

@Component({
  selector: 'app-builder-node-email',
  imports: [BuilderPropLabel, BuilderValidation],
  templateUrl: './builder-node-email.html',
  styleUrl: './builder-node-email.css',
})
export class BuilderNodeEmail {
  @Input() node!: Node;
}
