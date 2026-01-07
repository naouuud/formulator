import { Injectable } from '@angular/core';
import { FormModel } from '../models/form-model';
import { Group, GroupType } from '../models/group-types';
import { LocalStorageService } from './local-storage';

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  formModel: FormModel;

  constructor(private localStorage: LocalStorageService) {
    this.formModel = this.localStorage.has('formModel')
      ? this._returnFormModelFromLocalStorage(this.localStorage.get('formModel'))
      : this._returnNewFormModel();
  }

  setFormName_S(value: string): void {
    this.formModel.setFormName(value);
    this._saveFormModelToLocalStorage();
  }

  addGroup_S(groupType: GroupType): void {
    this.formModel.addGroup(groupType);
    this._saveFormModelToLocalStorage();
  }

  reorderGroup_S(fromIndex: number, toIndex: number): void {
    this.formModel.reorderGroup(fromIndex, toIndex);
    this._saveFormModelToLocalStorage();
  }

  deleteGroup_S(groupId: string): void {
    this.formModel.deleteGroup(groupId);
    this._saveFormModelToLocalStorage();
  }

  private _returnNewFormModel(): FormModel {
    const formModel = new FormModel();
    // formModel.addGroup(GroupType.NAME);
    return formModel;
  }

  private _returnFormModelFromLocalStorage(json: any): FormModel {
    const formModel = FormModel.fromJSON(json);
    return formModel;
  }

  private _saveFormModelToLocalStorage(): void {
    this.localStorage.set<FormModel>('formModel', this.formModel);
    // console.log('Saving to LS');
  }
}
