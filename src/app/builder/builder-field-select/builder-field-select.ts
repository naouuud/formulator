import { Component, Input, OnInit, signal } from '@angular/core';
import { Field, Option } from '../../models/field-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../../builder-validation/builder-validation';
import { AddOptions } from '../add-options/add-options';

@Component({
  selector: 'app-builder-field-select',
  imports: [BuilderPropLabel, BuilderValidation, AddOptions],
  templateUrl: './builder-field-select.html',
  styleUrl: './builder-field-select.css',
})
export class BuilderFieldSelect implements OnInit {
  @Input() field!: Field;
  // options$ = signal<Option[]>([]);

  ngOnInit(): void {
    // this.options$.set(this.field.options);
  }
}
