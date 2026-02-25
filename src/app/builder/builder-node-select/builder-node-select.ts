import { Component, Inject, Input } from '@angular/core';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { FormRepoLocal } from '../../services/form-repo-local';
import { BuilderOptions } from '../builder-options/builder-options';
import { Node } from '../../models/node-types';
import { FORM_REPO } from '../../app.config';
import { IFormRepo } from '../../services/form-repo';

@Component({
  selector: 'app-builder-node-select',
  imports: [BuilderPropLabel, BuilderValidation, BuilderOptions],
  templateUrl: './builder-node-select.html',
  styleUrl: './builder-node-select.css',
})
export class BuilderNodeSelect {
  @Input() node!: Node;
  dragDisabled$;

  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {
    this.dragDisabled$ = this.formRepo.dragDisabled$;
  }
}
