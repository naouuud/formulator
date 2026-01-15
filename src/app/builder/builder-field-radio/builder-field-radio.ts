import { Component, Input } from '@angular/core';
import { Field } from '../../models/field-types';
import { BuilderService } from '../../services/builder-service';
import { BuilderValidation } from '../../builder-validation/builder-validation';
import { AddOptions } from '../add-options/add-options';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';

@Component({
  selector: 'app-builder-field-radio',
  imports: [BuilderValidation, AddOptions, BuilderPropLabel],
  templateUrl: './builder-field-radio.html',
  styleUrl: './builder-field-radio.css',
})
export class BuilderFieldRadio {
  @Input() field!: Field;
  dragDisabled$;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }
}
