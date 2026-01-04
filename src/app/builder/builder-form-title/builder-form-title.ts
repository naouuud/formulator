import { Component, Input } from '@angular/core';
import { FormModel } from '../../models/form-model';

@Component({
  selector: 'app-builder-form-title',
  imports: [],
  templateUrl: './builder-form-title.html',
  styleUrl: './builder-form-title.css',
})
export class BuilderFormTitle {
  @Input() formModel!: FormModel;
}
