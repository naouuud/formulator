import { Component } from '@angular/core';
import { CentralModelS } from '../../services/central-model-s';
import { Type } from '../../models/json-types';

@Component({
  selector: 'app-builder-form',
  imports: [],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  constructor(private centralModelS: CentralModelS) {
    for (const type of Object.values(Type)) {
      this.centralModelS.createSection(type);
    }
    console.log(this.centralModelS.formModel.sections);
  }
}
