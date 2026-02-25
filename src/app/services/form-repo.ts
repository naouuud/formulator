import { Signal, WritableSignal } from '@angular/core';
import { FormModel } from '../models/form-model';
import { FactoryType } from '../models/factory-types';
import { PropType, Option } from '../models/prop-types';
import { Node } from '../models/node-types';

export interface IFormRepo {
  loading$: WritableSignal<boolean>;
  activeIdx$: WritableSignal<number>;
  forms$: WritableSignal<FormModel[]>;
  activeForm$: Signal<FormModel>;
  dragDisabled$: WritableSignal<boolean>;
  showAllErrorMessages$: WritableSignal<boolean>;
  pointerPosition$: WritableSignal<{ x: number; y: number }>;
  groupIds$: WritableSignal<string[]>;
  setActiveIdx_S(index: number): void;
  addForm_S(): void;
  deleteForm_S(index: number): void;
  setFormTitle_S(value: string): void;
  addNode_S(nodeList: Node[], factoryType: FactoryType): Node;
  reorderNode_S(nodeList: Node[], fromIndex: number, toIndex: number): void;
  deleteNode_S(nodeList: Node[], nodeId: string): void;
  toggleRadioCheckbox_S(node: Node): void;
  setProp_S(node: Node, propType: PropType, value: unknown): void;
  addOption_S(node: Node, option: Option): void;
  deleteOption_S(node: Node, idx: number): void;
  reorderOption_S(node: Node, fromIndex: number, toIndex: number): void;
  getOptionLists_S(): Option[][];
  replaceOptions_S(node: Node, optionList: Option[]): void;
}
