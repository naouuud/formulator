import { Component, Input } from '@angular/core';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { PropType } from '../../models/prop-types';
import { Node } from '../../models/node-types';

@Component({
  selector: 'app-builder-node-textarea',
  imports: [BuilderPropLabel, BuilderValidation],
  templateUrl: './builder-node-textarea.html',
  styleUrl: './builder-node-textarea.css',
})
export class BuilderNodeTextarea {
  @Input() node!: Node;
  PropType = PropType;
}
