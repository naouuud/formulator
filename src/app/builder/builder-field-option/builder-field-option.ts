import { Component, Input } from '@angular/core';
import { Field } from '../../models/field-types';
import { BuilderService } from '../../services/builder-service';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { AddOptions } from '../add-options/add-options';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';

@Component({
  selector: 'app-builder-field-option',
  imports: [BuilderValidation, AddOptions, BuilderPropLabel],
  templateUrl: './builder-field-option.html',
  styleUrl: './builder-field-option.css',
})
export class BuilderFieldOption {
  @Input() field!: Field;
  dragDisabled$;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }
}
