import { Component, Input } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderOptions } from '../builder-options/builder-options';
import { Node } from '../../models/node-types';

@Component({
  selector: 'app-builder-node-option',
  imports: [BuilderValidation, BuilderPropLabel, BuilderOptions],
  templateUrl: './builder-node-option.html',
  styleUrl: './builder-node-option.css',
})
export class BuilderNodeOption {
  @Input() node!: Node;
  dragDisabled$;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }
}
