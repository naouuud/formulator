import { Component, Input, OnInit, signal } from '@angular/core';
import { Field, Option } from '../../models/field-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { AddOptions } from '../add-options/add-options';
import { BuilderService } from '../../services/builder-service';

@Component({
  selector: 'app-builder-field-select',
  imports: [BuilderPropLabel, BuilderValidation, AddOptions],
  templateUrl: './builder-field-select.html',
  styleUrl: './builder-field-select.css',
})
export class BuilderFieldSelect {
  @Input() field!: Field;
  dragDisabled$;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }
}
