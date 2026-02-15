import { Component } from '@angular/core';
import { BuilderService } from '../services/builder-service';
import { FormIcon } from '../form-icon/form-icon';

@Component({
  selector: 'app-form-menu',
  imports: [FormIcon],
  templateUrl: './form-menu.html',
  styleUrl: './form-menu.css',
})
export class FormMenu {
  forms$;
  constructor(private builderService: BuilderService) {
    this.forms$ = this.builderService.forms$;
  }

  addForm_C() {
    this.builderService.addForm_S();
  }
}
