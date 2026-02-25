import { Component, computed, Inject, Input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormRepoLocal } from '../../services/form-repo-local';
import { CommonModule } from '@angular/common';
import { LABEL_MAX_LENGTH } from '../../models/field-types';
import { IFormRepo } from '../../services/form-repo';
import { FORM_REPO } from '../../app.config';

@Component({
  selector: 'app-builder-prop-label',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './builder-prop-label.html',
  styleUrl: './builder-prop-label.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderPropLabel {
  dragDisabled$;
  controlDisabled;
  showAllErrorMessages$;
  showRequiredError$;
  requiredErrorMessage = 'Blank question detected';
  maxCount = LABEL_MAX_LENGTH;
  currentCount;
  @Input() labelMessage!: string;

  constructor(
    public controlContainer: ControlContainer,
    @Inject(FORM_REPO) private formRepo: IFormRepo,
  ) {
    this.dragDisabled$ = this.formRepo.dragDisabled$;
    this.showAllErrorMessages$ = this.formRepo.showAllErrorMessages$;
    this.showRequiredError$ = computed(() => {
      if (this.showAllErrorMessages$()) return this.#getControl()?.getError('required');
    });
    this.currentCount = this.#getControl()?.value.length;
    this.#getControl()?.valueChanges.subscribe((value) => {
      this.currentCount = value.length;
    });
    this.controlDisabled = !!this.#getControl()?.disabled;
  }

  endEdit(event: Partial<KeyboardEvent>) {
    // event.preventDefault();
    (event.target as HTMLInputElement).blur();
  }

  #getControl(): AbstractControl | null {
    return this.controlContainer?.control?.get('label') ?? null;
  }
}
