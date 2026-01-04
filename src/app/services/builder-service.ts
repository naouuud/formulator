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
    const formModel = this._loadFormModelFromLocalStorage() ?? this._createNewFormModel();
    this.formModel = formModel;
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

  private _createNewFormModel(): FormModel {
    const formModel = new FormModel();
    formModel.setFormName('Example Form');
    return formModel;
  }

  private _loadFormModelFromLocalStorage(): FormModel | null {
    return this.localStorage.get<FormModel>('formModel');
  }

  private _saveFormModelToLocalStorage(): void {
    this.localStorage.set<FormModel>('formModel', this.formModel);
  }
}
