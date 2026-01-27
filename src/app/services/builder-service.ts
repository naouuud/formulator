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
  formModel$ = signal(new FormModel());
  saveFormSB = new Subject<void>();
  dragDisabled$ = signal(false); // prevents group drag

  constructor(private localStorage: LocalStorageService) {
    // this.formModel = this.localStorage.has('formModel')
    //   ? this.#returnFormModelFromLocalStorage(this.localStorage.get('formModel'))
    //   : this.#returnNewFormModel();
    const savedModelExists = this.localStorage.has('formModel');
    if (savedModelExists) this.formModel$.set(this.#returnFormModelFromLocalStorage());
    this.saveFormSB
      .asObservable()
      .pipe(debounceTime(1000))
      .subscribe(() => this.#saveToLocalStorage());
  }

  addOption_S(field: Field, option: Option): void {
    field.addOption(option);
    this.saveFormSB.next();
  }

  deleteOption_S(field: Field, idx: number): void {
    field.deleteOption(idx);
    this.saveFormSB.next();
  }

  reorderOption_S(field: Field, fromIndex: number, toIndex: number): void {
    field.reorderOption(fromIndex, toIndex);
    this.saveFormSB.next();
  }

  // application level ds
  getOptionLists_S(): Option[][] {
    const optionLists: Option[][] = [];
    this.formModel$().groups.forEach((g) => {
      if (![GroupType.CHECKBOX, GroupType.RADIO, GroupType.SELECT].includes(g.groupType)) return;
      g.fields.forEach((f) => {
        if (!f.options.length) return;
        optionLists.push([...f.options]);
      });
    });
    if (optionLists.length < 2) return optionLists;
    // remove duplicates (BRUTE)
    for (let i = 0; i < optionLists.length - 1; i++) {
      let j = i + 1;
      while (j < optionLists.length) {
        if (this.#arraysEqual(optionLists[i], optionLists[j])) {
          optionLists.splice(j, 1);
        } else {
          j++;
        }
      }
    }
    return optionLists;
  }

  replaceOptions_S(group: Group, optionList: Option[]): void {
    if (![GroupType.CHECKBOX, GroupType.RADIO, GroupType.SELECT].includes(group.groupType)) return;
    const field = group.fields[0];
    field.replaceOptions(optionList);
    this.saveFormSB.next();
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
    this.saveFormSB.next();
  }

  setFormName_S(value: string): void {
    this.formModel$().setFormName(value);
    this.saveFormSB.next();
  }

  toggleRadioCheckbox_S(group: Group): void {
    group.toggleRadioCheckbox();
    this.saveFormSB.next();
  }

  addGroup_S(groupType: GroupType): Group {
    const group = this.formModel$().addGroup(groupType);
    this.saveFormSB.next();
    return group;
  }

  reorderGroup_S(fromIndex: number, toIndex: number): void {
    this.formModel$().reorderGroup(fromIndex, toIndex);
    this.saveFormSB.next();
  }

  deleteGroup_S(groupId: string): void {
    this.formModel$().deleteGroup(groupId);
    this.saveFormSB.next();
  }

  // #returnNewFormModel(): FormModel {
  //   const formModel = new FormModel();
  //   // formModel.addGroup(GroupType.NAME);
  //   return formModel;
  // }

  #returnFormModelFromLocalStorage(): FormModel {
    // const formModel = FormModel.deserialize(json);
    const formModelJSON = this.localStorage.get('formModel');
    const formModel = FormModel.deserialize(formModelJSON);
    return formModel;
  }

  #saveToLocalStorage(): void {
    this.localStorage.set('formModel', { ...this.formModel$() }); // replace with FormModel.serialize()
    console.log(this.formModel$());
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

  // util
  #arraysEqual(a: string[] | null | undefined, b: string[] | null | undefined): boolean {
    // console.log(a, b);
    if (a === undefined || b === undefined) return false;
    if (a === null || b === null) return a === b;
    if (a.length !== b.length) return false;
    return a.every((value) => b.includes(value)) && b.every((value) => a.includes(value));
  }
}
