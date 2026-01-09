import { Injectable } from '@angular/core';
import { FormModel } from '../models/form-model';
import { GroupType } from '../models/group-types';
import { LocalStorageService } from './local-storage';
import { Field } from '../models/field-types';
import { PropType, PropValueMap } from '../models/prop-types';

type PropSchemaType = {
  [K in keyof PropValueMap]: {
    type: 'string' | 'number' | 'boolean' | 'regexp';
  };
};

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

  setProp_S(field: Field, propType: PropType, value: unknown) {
    if (!this._isValidPropValue(propType, value)) {
      throw new Error(
        `Invalid value for propType '${propType}'. ` +
          `Expected ${this._PropSchema[propType].type}, ` +
          `received ${this._describeValue(value)}.`
      );
    }
    field.setProp(propType, value);
    this._saveFormModelToLocalStorage();
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
    console.log('Saving');
  }

  // runtime validation for props
  private _PropSchema: PropSchemaType = {
    [PropType.LABEL]: { type: 'string' },
    [PropType.PLACEHOLDER]: { type: 'string' },
    [PropType.MAXLENGTH]: { type: 'number' },
    [PropType.MINLENGTH]: { type: 'number' },
    [PropType.REQUIRED]: { type: 'boolean' },
    [PropType.EMAIL]: { type: 'boolean' },
    [PropType.MAXVALUE]: { type: 'number' },
    [PropType.MINVALUE]: { type: 'number' },
    [PropType.PATTERN]: { type: 'regexp' },
    [PropType.MAXDATE]: { type: 'string' },
    [PropType.MINDATE]: { type: 'string' },
    [PropType.MAXYEARDISP]: { type: 'number' },
    [PropType.MINYEARDISP]: { type: 'number' },
  } as const;

  private _isValidPropValue<K extends PropType>(
    propType: K,
    value: unknown
  ): value is PropValueMap[K] {
    const schema = this._PropSchema[propType];
    if (!schema) return false;

    switch (schema.type) {
      case 'string':
        return typeof value === 'string';

      case 'number':
        return typeof value === 'number' && !Number.isNaN(value);

      case 'boolean':
        return typeof value === 'boolean';

      case 'regexp':
        return value instanceof RegExp;

      default:
        return false;
    }
  }

  // for error message
  private _describeValue(value: unknown): string {
    if (value === null) return 'null';
    if (value instanceof RegExp) return 'RegExp';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
}
