import { factoryMap, FactoryType } from './factory-types';
import { Node, NodeDto, NodeType } from './node-types';
import { createDateRange, PropType, todayString } from './prop-types';

export type FormModelDto = {
  formId: ReturnType<typeof crypto.randomUUID>;
  formName: string;
  // groups: GroupDto[];
  nodes: NodeDto[];
};

export class FormModel {
  formId: ReturnType<typeof crypto.randomUUID>;
  formName: string;
  // groups: Group[];
  nodes: Node[];

  constructor() {
    this.formId = crypto.randomUUID();
    this.formName = '';
    // this.groups = [];
    this.nodes = [];
  }

  setFormName(value: string): void {
    this.formName = value.trim();
  }

  // addGroup(groupType: GroupType): Group {
  //   const group = Group.create(groupType);
  //   this.groups.push(group);
  //   return group;
  // }

  getNodes(): Node[] {
    const allNodes: Node[] = [];
    const queue: Node[] = [];
    allNodes.push(...this.nodes);
    queue.push(...this.nodes);

    const iter = (queueRef: Node[]) => {
      const originalLength = queueRef.length;
      for (let i = 0; i < originalLength; i++) {
        const nextNode = queueRef.shift()!;
        allNodes.push(...nextNode.nodes);
        queueRef.push(...nextNode.nodes);
      }
      if (!queueRef.length) return allNodes;
      return iter(queueRef);
    };

    return iter(queue);
  }

  add(factoryType: FactoryType): Node[] {
    const factory = factoryMap.get(factoryType);
    if (!factory) {
      throw new Error(
        `Internal Error: No factory registered for factoryType '${factoryType}'. Did you forget to add it to factoryMap?`,
      );
    }
    const nodes = factory();
    this.nodes.push(...nodes);
    return nodes;
  }

  // reorderGroup(fromIndex: number, toIndex: number): void {
  //   const newArray = [...this.groups]; // create a shallow copy to avoid mutating original
  //   const [movedItem] = newArray.splice(fromIndex, 1); // remove item
  //   newArray.splice(toIndex, 0, movedItem); // insert at new index
  //   this.groups = newArray;
  // }

  reorderNode(fromIndex: number, toIndex: number): void {
    const newArray = [...this.nodes]; // create a shallow copy to avoid mutating original
    const [movedItem] = newArray.splice(fromIndex, 1); // remove item
    newArray.splice(toIndex, 0, movedItem); // insert at new index
    this.nodes = newArray;
  }

  // deleteGroup(groupId: string): void {
  //   const deleteGroup = this.groups.find((g) => g.groupId === groupId);
  //   if (deleteGroup === undefined) {
  //     throw Error(`No group with groupId '${groupId}' found to delete`);
  //   }
  //   const deleteIdx = this.groups.indexOf(deleteGroup);
  //   this.groups.splice(deleteIdx, 1);
  // }

  deleteNode(nodeId: string): void {
    const deleteGroup = this.nodes.find((n) => n.nodeId === nodeId);
    if (deleteGroup === undefined) {
      throw Error(`No node with nodeId '${nodeId}' found to delete`);
    }
    const deleteIdx = this.nodes.indexOf(deleteGroup);
    this.nodes.splice(deleteIdx, 1);
  }

  // Apply domain checks here!
  // static serialize(formModel: FormModel) {
  //   const formModelDto: FormModelDto = { ...formModel };
  //   formModelDto.groups = (formModel.groups ?? []).map((g: Group) => Group.serialize(g));
  //   return formModelDto;
  // }

  static serialize(formModel: FormModel): FormModelDto {
    const formModelDto: FormModelDto = { ...formModel };
    formModelDto.nodes = (formModel.nodes ?? []).map((n) => Node.serialize(n));
    return formModelDto;
  }

  // static deserialize(formModelDto: FormModelDto): FormModel {
  //   const formModel = new FormModel(); // create new form model
  //   Object.assign(formModel, formModelDto); // copy enumerable properties
  //   formModel.groups = (formModelDto.groups ?? []).map((g: GroupDto) => Group.deserialize(g)); // initialize new groups
  //   return formModel;
  // }

  static deserialize(formModelDto: FormModelDto): FormModel {
    const formModel = new FormModel();
    Object.assign(formModel, formModelDto);
    formModel.nodes = (formModelDto.nodes ?? []).map((n) => Node.deserialize(n));
    return formModel;
  }
}
