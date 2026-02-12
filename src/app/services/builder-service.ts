import { effect, Injectable, Signal, signal } from '@angular/core';
import { FormModel, FormModelDto } from '../models/form-model';
import { LocalStorageService } from './local-storage';
import { PropType, PropValueMap, Option } from '../models/prop-types';
import { debounceTime, Subject } from 'rxjs';
import { Node, NodeType } from '../models/node-types';
import { Factory, FactoryType } from '../models/factory-types';
import { N } from '@angular/cdk/keycodes';

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
  showAllErrorMessages$;
  pointerPosition$;
  groupIds$;

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
    this.showAllErrorMessages$ = signal(false);
    this.pointerPosition$ = signal<{ x: number; y: number }>({ x: 0, y: 0 });
    this.groupIds$ = signal<string[]>([]);
    // initialize groupIds
    effect(() => {
      const formModel = this.formModel$();
      this.groupIds$.set(
        Node.flat(...this.formModel$().nodes)
          .filter((n) => n.nodeType === NodeType.GROUP)
          .map((n) => n.nodeId),
      );
    });
    // effect(() => console.log('Group ids:', this.groupIds$()));
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

  addOption_S(node: Node, option: Option): void {
    node.addOption(option);
    this.saveFormSb.next();
  }

  deleteOption_S(node: Node, idx: number): void {
    node.deleteOption(idx);
    this.saveFormSb.next();
  }

  reorderOption_S(node: Node, fromIndex: number, toIndex: number): void {
    node.reorderOption(fromIndex, toIndex);
    this.saveFormSb.next();
  }

  getOptionLists_S(): Option[][] {
    const optionLists: Option[][] = [];
    const flatNodeList = Node.flat(...this.formModel$().nodes);
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
    this.saveFormSb.next();
  }

  setProp_S(node: Node, propType: PropType, value: unknown) {
    if (!this.#isValidPropValue(propType, value)) {
      throw new Error(
        `Invalid value for propType '${propType}'. ` +
          `Expected ${this.#propSchema[propType].type}, ` +
          `received ${this.#describeValue(value)}.`,
      );
    }
    node.setProp(propType, value);
    this.saveFormSb.next();
  }

  setFormName_S(value: string): void {
    this.formModel$().setFormName(value);
    this.saveFormSb.next();
  }

  toggleRadioCheckbox_S(node: Node): void {
    node.toggleRadioCheckbox();
    this.saveFormSb.next();
  }

  addNode_S(nodeList: Node[], factoryType: FactoryType): Node {
    const node = Factory.make(factoryType);
    Node.append(nodeList, node);
    this.#addGroupId(node); // UI concern
    this.saveFormSb.next();
    return node;
  }

  reorderNode_S(nodeList: Node[], fromIndex: number, toIndex: number): void {
    Node.reorder(nodeList, fromIndex, toIndex);
    this.saveFormSb.next();
  }

  deleteNode_S(nodeList: Node[], nodeId: string): void {
    Node.delete(nodeList, nodeId);
    this.#deleteGroupId(nodeId); // UI concern
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
    // console.log('Form Schema Saved', serializedFormModel);
    console.log('Saved');
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
