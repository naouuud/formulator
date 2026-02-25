import { Component, Inject, Input } from '@angular/core';
import { FormRepoLocal } from '../../services/form-repo-local';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderOptions } from '../builder-options/builder-options';
import { Node } from '../../models/node-types';
import { FORM_REPO } from '../../app.config';
import { IFormRepo } from '../../services/form-repo';

@Component({
  selector: 'app-builder-node-option',
  imports: [BuilderValidation, BuilderPropLabel, BuilderOptions],
  templateUrl: './builder-node-option.html',
  styleUrl: './builder-node-option.css',
})
export class BuilderNodeOption {
  @Input() node!: Node;
  dragDisabled$;

  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {
    this.dragDisabled$ = this.formRepo.dragDisabled$;
  }
}
