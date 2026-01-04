import { Injectable } from '@angular/core';
import { FormModel } from '../models/form-model';
import { Group, groupMap, GroupType } from '../models/group-types';
import { LocalStorageService } from './local-storage';

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  formModel: FormModel;

  constructor(private localStorage: LocalStorageService) {
    this.formModel = this.localStorage.has('formModel')
      ? this._returnFormModelFromLocalStorage()
      : this._returnNewFormModel();
  }

  addGroupFromService(groupType: GroupType): Group | undefined {
    const factory = groupMap.get(groupType);
    if (!factory) return;
    const group = factory();
    this.formModel.addGroup(group);
    this._saveFormModelToLocalStorage();
    return group;
  }

  reorderGroupFromService(fromIndex: number, toIndex: number): void {
    this.formModel.reorderGroup(fromIndex, toIndex);
  }

  deleteGroupFromService(groupId: string): Error | void {
    const error = this.formModel.deleteGroup(groupId);
    if (!error) {
      this._saveFormModelToLocalStorage();
      return;
    }
    return error;
  }

  private _returnNewFormModel(): FormModel {
    const formModel = new FormModel();
    this.formModel.setFormName('Untitled Form');
    return formModel;
  }

  private _returnFormModelFromLocalStorage(): FormModel {
    const formModel = new FormModel();
    const savedModel = this.localStorage.get<FormModel>('formModel');
    formModel.updateFromSavedModel(savedModel);
    return formModel;
  }

  private _saveFormModelToLocalStorage(): void {
    this.localStorage.set<FormModel>('formModel', this.formModel);
  }
}
