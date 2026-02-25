import { Component, Inject } from '@angular/core';
import { FormRepoLocal } from '../services/form-repo-local';
import { FormIcon } from '../form-icon/form-icon';
import { FORM_REPO } from '../app.config';
import { IFormRepo } from '../services/form-repo';

@Component({
  selector: 'app-form-menu',
  imports: [FormIcon],
  templateUrl: './form-menu.html',
  styleUrl: './form-menu.css',
})
export class FormMenu {
  forms$;
  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {
    this.forms$ = this.formRepo.forms$;
  }

  addForm_C() {
    this.formRepo.addForm_S();
  }
}
