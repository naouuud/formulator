import { Component } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-builder-validation-daterange',
  imports: [],
  templateUrl: './builder-validation-daterange.html',
  styleUrl: './builder-validation-daterange.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderValidationDaterange {
  constructor(public controlContainer: ControlContainer) {}
}
