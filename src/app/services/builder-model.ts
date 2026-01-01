import { Injectable } from '@angular/core';
import { FormModel } from '../models/form-model';
import { Group, groupMap, GroupType } from '../models/group-types';

@Injectable({
  providedIn: 'root',
})
export class BuilderModel {
  formModel: FormModel = new FormModel();

  constructor() {
    // TEST FORM
    this.formModel.setFormName('Builder Test Form');
    for (const groupType of Object.values(GroupType)) {
      this.createGroup(groupType);
    }
    console.log(this.formModel);
  }

  createGroup(groupType: GroupType): Group | undefined {
    const factory = groupMap.get(groupType);
    if (!factory) return;
    const group = factory();
    this.formModel.addGroup(group);
    return group;
  }
}
