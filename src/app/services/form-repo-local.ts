import { computed, effect, Injectable, signal } from '@angular/core';
import { FormModel, FormModelDto } from '../models/form-model';
import { LocalStorageService } from './local-storage';
import { PropType, PropValueMap, Option } from '../models/prop-types';
import { debounceTime, delay, Observable, of, Subject, tap } from 'rxjs';
import { Node, NodeType } from '../models/node-types';
import { Factory, FactoryType } from '../models/factory-types';
import { AuthService } from './api/auth-service';
import { FormService } from './api/form-service';
import { IFormRepo } from './form-repo';

// const FRESH_START: FormModel[] = [new FormModel()] as const;

export type PropSchemaType = {
  [K in keyof PropValueMap]: {
    type: 'string' | 'number' | 'boolean' | 'regexp' | 'object';
  };
};

@Injectable({
  providedIn: 'root',
})
export class FormRepoLocal implements IFormRepo {
  loading$;
  activeIdx$;
  forms$;
  activeForm$;
  #saveSB;
  dragDisabled$;
  showAllErrorMessages$;
  pointerPosition$;
  groupIds$;

  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private formService: FormService,
  ) {
    // Data
    this.loading$ = signal(true);
    this.activeIdx$ = signal(0);
    this.forms$ = signal<FormModel[]>([]);
    this.activeForm$ = computed(() => this.forms$()[this.activeIdx$()]); // Error?
    // effect(() => console.log(this.activeForm$()));
    this.#saveSB = new Subject<void>();
    this.#saveSB
      .asObservable()
      .pipe(debounceTime(1000))
      .subscribe(() => this.#saveToLocalStorage());

    // Validation
    this.showAllErrorMessages$ = signal(false);

    // Drag
    this.dragDisabled$ = signal(false); // prevents Node drag during internal operations
    this.pointerPosition$ = signal<{ x: number; y: number }>({ x: 0, y: 0 });
    this.groupIds$ = signal<string[]>([]);
    // Reset groupIds when activeForm changes
    effect(() => {
      const activeForm = this.activeForm$();
      if (!activeForm) {
        this.groupIds$.set([]);
        return;
      }
      this.groupIds$.set(
        Node.flat(...this.activeForm$().nodes)
          .filter((n) => n.nodeType === NodeType.GROUP)
          .map((n) => n.nodeId),
      );
    });

    this.#fetchFromLocalStorage().subscribe();
  }

  #fetchFromLocalStorage() {
    return of(1).pipe(
      delay(500),
      tap(() => {
        const hasLocalForms = this.localStorage.has('localForms');
        if (!hasLocalForms) this.forms$.set([new FormModel()]);
        else {
          const formsDto = this.localStorage.get<FormModelDto[]>('localForms')!;
          const forms = this.#deserialize_S(formsDto);
          this.forms$.set(forms);
        }
      }),
      tap(() => this.loading$.set(false)),
    );
  }

  #saveToLocalStorage(): void {
    const serializedForms = this.#serialize_S(this.forms$());
    this.localStorage.set('localForms', serializedForms); // double serialization
    // console.log('Saved', serializedForms);
    console.log('Saved');
  }

  // APPLY CHECKS HERE
  #deserialize_S(formModelDtoArray: FormModelDto[]): FormModel[] {
    return formModelDtoArray.map((f) => FormModel.deserialize(f));
  }

  #serialize_S(formModelArray: FormModel[]): FormModelDto[] {
    return formModelArray.map((f) => FormModel.serialize(f));
  }

  #addGroupId(node: Node): void {
    if (node.nodeType !== NodeType.GROUP) return;
    const groupDropIds = this.groupIds$();
    if (!groupDropIds.find((id) => id === node.nodeId)) {
      this.groupIds$.set([...groupDropIds, node.nodeId]);
    }
  }

  #deleteGroupId(idIn: string): void {
    const newArray = [...this.groupIds$()];
    const id = newArray.find((id) => id === idIn);
    if (!id) return;
    const idIdx = newArray.indexOf(id);
    newArray.splice(idIdx, 1);
    this.groupIds$.set(newArray);
  }

  setActiveIdx_S(index: number): void {
    const length = this.forms$().length;
    if (index > length - 1) this.activeIdx$.set(length - 1);
    else this.activeIdx$.set(index);
  }

  addForm_S(): void {
    const newForm = new FormModel();
    const tempId = newForm.formId;
    this.forms$.update((val) => [...val, newForm]);
    this.setActiveIdx_S(this.forms$().length - 1);
    this.#saveSB.next();
  }

  deleteForm_S(index: number): void {
    const val = this.forms$();
    const [deletedForm] = val.splice(index, 1);
    if (!val.length) {
      this.forms$.set([new FormModel()]);
    } else {
      this.forms$.set([...val]);
      this.setActiveIdx_S(this.activeIdx$()); // handles last index problem
    }
    this.#saveSB.next();
  }

  setFormTitle_S(value: string): void {
    this.activeForm$().setFormTitle(value);
    this.#saveSB.next();
  }

  addNode_S(nodeList: Node[], factoryType: FactoryType): Node {
    const node = Factory.make(factoryType);
    Node.append(nodeList, node);
    this.#addGroupId(node); // UI concern
    this.#saveSB.next();
    return node;
  }

  reorderNode_S(nodeList: Node[], fromIndex: number, toIndex: number): void {
    Node.reorder(nodeList, fromIndex, toIndex);
    this.#saveSB.next();
  }

  deleteNode_S(nodeList: Node[], nodeId: string): void {
    Node.delete(nodeList, nodeId);
    this.#deleteGroupId(nodeId); // UI concern
    this.#saveSB.next();
  }

  toggleRadioCheckbox_S(node: Node): void {
    node.toggleRadioCheckbox();
    this.#saveSB.next();
  }

  setProp_S(node: Node, propType: PropType, value: unknown): void {
    if (!this.#isValidPropValue(propType, value)) {
      throw new Error(
        `Invalid value for propType '${propType}'. ` +
          `Expected ${this.#propSchema[propType].type}, ` +
          `received ${this.#describeValue(value)}.`,
      );
    }
    node.setProp(propType, value);
    this.#saveSB.next();
  }

  addOption_S(node: Node, option: Option): void {
    node.addOption(option);
    this.#saveSB.next();
  }

  deleteOption_S(node: Node, idx: number): void {
    node.deleteOption(idx);
    this.#saveSB.next();
  }

  reorderOption_S(node: Node, fromIndex: number, toIndex: number): void {
    node.reorderOption(fromIndex, toIndex);
    this.#saveSB.next();
  }

  getOptionLists_S(): Option[][] {
    const optionLists: Option[][] = [];
    const flatNodeList = Node.flat(...this.activeForm$().nodes);
    flatNodeList.forEach((n) => {
      if (![NodeType.CHECKBOX, NodeType.RADIO, NodeType.SELECT].includes(n.nodeType)) return;
      if (!n.getOptions().length) return;
      optionLists.push([...n.getOptions()]);
    });
    if (optionLists.length < 2) return optionLists;
    // Remove duplicate lists
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

  replaceOptions_S(node: Node, optionList: Option[]): void {
    if (![NodeType.CHECKBOX, NodeType.RADIO, NodeType.SELECT].includes(node.nodeType)) return;
    node.setOptions(optionList);
    this.#saveSB.next();
  }

  // runtime prop validation
  #propSchema: PropSchemaType = {
    [PropType.LABEL]: { type: 'string' },
    [PropType.PLACEHOLDER]: { type: 'string' },
    [PropType.MAXLENGTHCHAR]: { type: 'number' },
    [PropType.MAXLENGTHWORD]: { type: 'number' },
    [PropType.REQUIRED]: { type: 'boolean' },
    [PropType.EMAIL]: { type: 'boolean' },
    // [PropType.MAXVALUE]: { type: 'number' },
    // [PropType.MINVALUE]: { type: 'number' },
    [PropType.PATTERNPHONE]: { type: 'boolean' },
    [PropType.PATTERNNUMBER]: { type: 'boolean' },
    [PropType.DATERANGE]: { type: 'object' },
    [PropType.OPTIONS]: { type: 'object' },
    [PropType.OPTIONOTHER]: { type: 'boolean' },
    [PropType.ALLOWTOGGLE]: { type: 'boolean' },
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
