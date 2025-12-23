import { Component } from '@angular/core';
import { CentralModelS } from '../../services/central-model-s';
import { FormModel } from '../../models/group-types';
import { BuilderField } from '../builder-field/builder-field';

@Component({
  selector: 'app-builder-form',
  // imports: [BuilderField],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  // formModel: FormModel;

  constructor(private centralModelS: CentralModelS) {
    // this.formModel = this.centralModelS.formModel;
  }
}
