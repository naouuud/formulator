import { Component, Input } from '@angular/core';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { BuilderService } from '../../services/builder-service';
import { BuilderOptions } from '../builder-options/builder-options';
import { Node } from '../../models/node-types';

@Component({
  selector: 'app-builder-node-select',
  imports: [BuilderPropLabel, BuilderValidation, BuilderOptions],
  templateUrl: './builder-node-select.html',
  styleUrl: './builder-node-select.css',
})
export class BuilderNodeSelect {
  @Input() node!: Node;
  dragDisabled$;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }
}
