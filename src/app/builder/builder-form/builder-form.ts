import { Component } from '@angular/core';
import { BuilderField } from '../builder-field/builder-field';
import { BuilderModel } from '../../services/builder-model';

@Component({
  selector: 'app-builder-form',
  // imports: [BuilderField],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  // formModel: FormModel;

  constructor(private builderModel: BuilderModel) {
    // this.formModel = this.centralModelS.formModel;
  }
}
