import { Injectable } from '@angular/core';
import { FormModel } from '../models/form-model';
import { GroupType } from '../models/group-types';

@Injectable({
  providedIn: 'root',
})
export class BuilderModel {
  formModel: FormModel = new FormModel();

  constructor() {
    // TEST FORM
    this.formModel.setFormName('Builder Test Form');
    for (const groupType of Object.values(GroupType)) {
      this.formModel.createGroup(groupType);
    }
    console.log(this.formModel);
  }
}
