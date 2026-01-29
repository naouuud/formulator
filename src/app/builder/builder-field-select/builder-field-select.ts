import { Component, Input, OnInit, signal } from '@angular/core';
import { Field } from '../../models/field-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { BuilderService } from '../../services/builder-service';
import { BuilderOptions } from '../builder-options/builder-options';

@Component({
  selector: 'app-builder-field-select',
  imports: [BuilderPropLabel, BuilderValidation, BuilderOptions],
  templateUrl: './builder-field-select.html',
  styleUrl: './builder-field-select.css',
})
export class BuilderFieldSelect {
  @Input() field!: Field;
  dragDisabled$;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  log(event: any) {
    console.log(event);
  }
}
