import { Injectable, signal } from '@angular/core';
import { FormModel } from '../models/form-model';
import { Group, GroupType } from '../models/group-types';
import { LocalStorageService } from './local-storage';
import { Field, FieldType, Option } from '../models/field-types';
import { Prop, PropType, PropValueMap } from '../models/prop-types';
import { debounceTime, Subject } from 'rxjs';

type PropSchemaType = {
  [K in keyof PropValueMap]: {
    type: 'string' | 'number' | 'boolean' | 'regexp' | 'object';
  };
};

type FieldDto = {
  fieldType: FieldType;
  fieldId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
  options: Option[];
};

type GroupDto = {
  groupType: GroupType;
  groupId: ReturnType<typeof crypto.randomUUID>;
  fields: FieldDto[];
};

type FormDto = {
  formId: ReturnType<typeof crypto.randomUUID>;
  formName: string;
  groups: GroupDto[];
};

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  formModel: FormModel;
  saveForm = new Subject<void>();
  dragDisabled$ = signal(false); // prevents group drag

  constructor(private localStorage: LocalStorageService) {
    this.formModel = this.localStorage.has('formModel')
      ? this.#returnFormModelFromLocalStorage(this.localStorage.get('formModel'))
      : this.#returnNewFormModel();
    this.saveForm.next();
    this.saveForm
      .asObservable()
      .pipe(debounceTime(1000))
      .subscribe(() => this.#saveToLocalStorage());
  }

  addOption_S(field: Field, option: Option): void {
    field.addOption(option);
    this.saveForm.next();
  }

  deleteOption_S(field: Field, idx: number): void {
    field.deleteOption(idx);
    this.saveForm.next();
  }

  reorderOption_S(field: Field, fromIndex: number, toIndex: number): void {
    field.reorderOption(fromIndex, toIndex);
    this.saveForm.next();
  }

  setProp_S(field: Field, propType: PropType, value: unknown) {
    if (!this.#isValidPropValue(propType, value)) {
      throw new Error(
        `Invalid value for propType '${propType}'. ` +
          `Expected ${this.#propSchema[propType].type}, ` +
          `received ${this.#describeValue(value)}.`,
      );
    }
    field.setProp(propType, value);
    this.saveForm.next();
  }

  setFormName_S(value: string): void {
    this.formModel.setFormName(value);
    this.saveForm.next();
  }

  toggleRadioCheckbox_S(group: Group): void {
    group.toggleRadioCheckbox();
    this.saveForm.next();
  }

  addGroup_S(groupType: GroupType): void {
    this.formModel.addGroup(groupType);
    this.saveForm.next();
  }

  reorderGroup_S(fromIndex: number, toIndex: number): void {
    this.formModel.reorderGroup(fromIndex, toIndex);
    this.saveForm.next();
  }

  deleteGroup_S(groupId: string): void {
    this.formModel.deleteGroup(groupId);
    this.saveForm.next();
  }

  #returnNewFormModel(): FormModel {
    const formModel = new FormModel();
    // formModel.addGroup(GroupType.NAME);
    return formModel;
  }

  #returnFormModelFromLocalStorage(json: any): FormModel {
    const formModel = FormModel.deserialize(json);
    return formModel;
  }

  #saveToLocalStorage(): void {
    this.localStorage.set('formModel', { ...this.formModel }); // need explicit conversion to Dto
    console.log(this.formModel);
  }

  // runtime prop validation
  #propSchema: PropSchemaType = {
    [PropType.LABEL]: { type: 'string' },
    [PropType.PLACEHOLDER]: { type: 'string' },
    [PropType.MAXLENGTHCHAR]: { type: 'number' },
    [PropType.MAXLENGTHWORD]: { type: 'number' },
    [PropType.REQUIRED]: { type: 'boolean' },
    [PropType.EMAIL]: { type: 'boolean' },
    [PropType.MAXVALUE]: { type: 'number' },
    [PropType.MINVALUE]: { type: 'number' },
    [PropType.PATTERNPHONE]: { type: 'boolean' },
    [PropType.PATTERNNUMBER]: { type: 'boolean' },
    [PropType.DATERANGE]: { type: 'object' },
  } as const;

  #isValidPropValue<K extends PropType>(propType: K, value: unknown): value is PropValueMap[K] {
    const schema = this.#propSchema[propType];
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
  #describeValue(value: unknown): string {
    if (value === null) return 'null';
    if (value instanceof RegExp) return 'RegExp';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
}
