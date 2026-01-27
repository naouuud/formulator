import { Injectable, signal } from '@angular/core';
import { FormModel, FormModelDto } from '../models/form-model';
import { Group, GroupType } from '../models/group-types';
import { LocalStorageService } from './local-storage';
import { Field, Option } from '../models/field-types';
import { PropType, PropValueMap } from '../models/prop-types';
import { debounceTime, Subject } from 'rxjs';

type PropSchemaType = {
  [K in keyof PropValueMap]: {
    type: 'string' | 'number' | 'boolean' | 'regexp' | 'object';
  };
};

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  formModel$;
  saveFormSb;
  dragDisabled$; // prevents group drag

  constructor(private localStorage: LocalStorageService) {
    this.formModel$ = this.localStorage.has('formModel')
      ? signal(this.#deserializeFormModel_S(this.localStorage.get('formModel')!))
      : signal(new FormModel());
    this.saveFormSb = new Subject<void>();
    this.saveFormSb
      .asObservable()
      .pipe(debounceTime(1000))
      .subscribe(() => this.#saveToLocalStorage_S());
    this.dragDisabled$ = signal(false);
  }

  addOption_S(field: Field, option: Option): void {
    field.addOption(option);
    this.saveFormSb.next();
  }

  deleteOption_S(field: Field, idx: number): void {
    field.deleteOption(idx);
    this.saveFormSb.next();
  }

  reorderOption_S(field: Field, fromIndex: number, toIndex: number): void {
    field.reorderOption(fromIndex, toIndex);
    this.saveFormSb.next();
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
    // remove duplicates (brute)
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
    this.saveFormSb.next();
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
    this.saveFormSb.next();
  }

  setFormName_S(value: string): void {
    this.formModel$().setFormName(value);
    this.saveFormSb.next();
  }

  toggleRadioCheckbox_S(group: Group): void {
    group.toggleRadioCheckbox();
    this.saveFormSb.next();
  }

  addGroup_S(groupType: GroupType): Group {
    const group = this.formModel$().addGroup(groupType);
    this.saveFormSb.next();
    return group;
  }

  reorderGroup_S(fromIndex: number, toIndex: number): void {
    this.formModel$().reorderGroup(fromIndex, toIndex);
    this.saveFormSb.next();
  }

  deleteGroup_S(groupId: string): void {
    this.formModel$().deleteGroup(groupId);
    this.saveFormSb.next();
  }

  #deserializeFormModel_S(formModelDto: FormModelDto): FormModel {
    return FormModel.deserialize(formModelDto);
  }

  #serializeFormModel_S(formModel: FormModel): FormModelDto {
    return FormModel.serialize(formModel);
  }

  #saveToLocalStorage_S(): void {
    const formModel = this.formModel$();
    const serializedFormModel = this.#serializeFormModel_S(formModel);
    this.localStorage.set('formModel', serializedFormModel);
    console.log(serializedFormModel);
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
