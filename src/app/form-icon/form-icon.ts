import { Component, computed, Inject, Input } from '@angular/core';
import { FormRepoLocal } from '../services/form-repo-local';
import { CommonModule } from '@angular/common';
import { IFormRepo } from '../services/form-repo';
import { FORM_REPO } from '../app.config';

@Component({
  selector: 'app-form-icon',
  imports: [CommonModule],
  templateUrl: './form-icon.html',
  styleUrl: './form-icon.css',
})
export class FormIcon {
  @Input() index!: number;
  @Input() formTitle!: string;
  @Input() formId!: string;
  activeIdx$;
  active$ = computed(() => this.activeIdx$() === this.index);

  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {
    this.activeIdx$ = this.formRepo.activeIdx$;
  }

  setActiveIdx_C(): void {
    this.formRepo.setActiveIdx_S(this.index);
  }

  deleteForm_C(event: PointerEvent): void {
    event.stopPropagation();
    this.formRepo.deleteForm_S(this.index);
  }
}
