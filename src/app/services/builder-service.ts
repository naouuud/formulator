import { Injectable, signal, WritableSignal } from '@angular/core';
import { FormModel } from '../models/form-model';
import { GroupType } from '../models/group-types';
import { LocalStorageService } from './local-storage';
import { Field, FieldType, Option } from '../models/field-types';
import { Prop, PropType, PropValueMap } from '../models/prop-types';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

type PropSchemaType = {
  [K in keyof PropValueMap]: {
    type: 'string' | 'number' | 'boolean' | 'regexp';
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
  private readonly _formModel$: WritableSignal<FormDto> = signal({ ...new FormModel() }); // DTO type
  readonly formModel$ = this._formModel$.asReadonly();

  constructor(private localStorage: LocalStorageService) {
    this.formModel = this.localStorage.has('formModel')
      ? this._returnFormModelFromLocalStorage(this.localStorage.get('formModel'))
      : this._returnNewFormModel();
    this._formModel$.set({ ...this.formModel });
    toObservable(this.formModel$)
      .pipe(debounceTime(1000))
      .subscribe({
        next: (val) => this._saveToLocalStorage(val),
      });
    // effect(() => {
    //   this._saveToLocalStorage(this.formModel$());
    // });
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
    this._formModel$.set({ ...this.formModel });
  }

  setFormName_S(value: string): void {
    this.formModel.setFormName(value);
    this._formModel$.set({ ...this.formModel });
  }

  addGroup_S(groupType: GroupType): void {
    this.formModel.addGroup(groupType);
    this._formModel$.set({ ...this.formModel });
  }

  reorderGroup_S(fromIndex: number, toIndex: number): void {
    this.formModel.reorderGroup(fromIndex, toIndex);
    this._formModel$.set({ ...this.formModel });
  }

  deleteGroup_S(groupId: string): void {
    this.formModel.deleteGroup(groupId);
    this._formModel$.set({ ...this.formModel });
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

  // private _saveFormModelToLocalStorage(): void {
  //   this.localStorage.set<FormModel>('formModel', this.formModel);
  //   console.log('Saving');
  // }

  private _saveToLocalStorage(formDto: FormDto): void {
    this.localStorage.set<FormDto>('formModel', formDto);
    console.log('Saved');
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
