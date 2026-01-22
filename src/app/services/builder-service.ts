import { Injectable, signal } from '@angular/core';
import { FormModel } from '../models/form-model';
import { Group, GroupType } from '../models/group-types';
import { LocalStorageService } from './local-storage';
import { Field, FieldType, Option, OptionOtherText } from '../models/field-types';
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
  saveFormSUB = new Subject<void>();
  dragDisabled$ = signal(false); // prevents group drag

  constructor(private localStorage: LocalStorageService) {
    this.formModel = this.localStorage.has('formModel')
      ? this.#returnFormModelFromLocalStorage(this.localStorage.get('formModel'))
      : this.#returnNewFormModel();
    // this.saveForm.next();
    this.saveFormSUB
      .asObservable()
      .pipe(debounceTime(1000))
      .subscribe(() => this.#saveToLocalStorage());
  }

  addOption_S(field: Field, option: Option): void {
    field.addOption(option);
    this.saveFormSUB.next();
  }

  deleteOption_S(field: Field, idx: number): void {
    field.deleteOption(idx);
    this.saveFormSUB.next();
  }

  reorderOption_S(field: Field, fromIndex: number, toIndex: number): void {
    field.reorderOption(fromIndex, toIndex);
    this.saveFormSUB.next();
  }

  // addOptionOther_S(field: Field): void {
  //   field.addOptionOther();
  //   this.saveFormSUB.next();
  // }

  // removeOptionOther_S(field: Field): void {
  //   field.removeOptionOther();
  //   this.saveFormSUB.next();
  // }

  setProp_S(field: Field, propType: PropType, value: unknown) {
    if (!this.#isValidPropValue(propType, value)) {
      throw new Error(
        `Invalid value for propType '${propType}'. ` +
          `Expected ${this.#propSchema[propType].type}, ` +
          `received ${this.#describeValue(value)}.`,
      );
    }
    field.setProp(propType, value);
    this.saveFormSUB.next();
  }

  setFormName_S(value: string): void {
    this.formModel.setFormName(value);
    this.saveFormSUB.next();
  }

  toggleRadioCheckbox_S(group: Group): void {
    group.toggleRadioCheckbox();
    this.saveFormSUB.next();
  }

  addGroup_S(groupType: GroupType): void {
    this.formModel.addGroup(groupType);
    this.saveFormSUB.next();
  }

  reorderGroup_S(fromIndex: number, toIndex: number): void {
    this.formModel.reorderGroup(fromIndex, toIndex);
    this.saveFormSUB.next();
  }

  deleteGroup_S(groupId: string): void {
    this.formModel.deleteGroup(groupId);
    this.saveFormSUB.next();
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
    [PropType.OPTIONOTHER]: { type: 'boolean' },
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
      case 'object':
        return typeof value === 'object';
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
