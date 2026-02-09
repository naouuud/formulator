import { factoryMap, FactoryType } from './factory-types';
import { Node, NodeDto, NodeType } from './node-types';
import { createDateRange, PropType, todayString } from './prop-types';

export type FormModelDto = {
  formId: ReturnType<typeof crypto.randomUUID>;
  formName: string;
  nodes: NodeDto[];
};

export class FormModel {
  formId: ReturnType<typeof crypto.randomUUID>;
  formName: string;
  nodes: Node[];

  constructor() {
    this.formId = crypto.randomUUID();
    this.formName = '';
    this.nodes = [];
  }

  setFormName(value: string): void {
    this.formName = value.trim();
  }

  // Array (un-nested)
  getFlatNodes(): Node[] {
    return Node.flatten(...this.nodes);
  }

  addNode(factoryType: FactoryType): Node {
    const factory = factoryMap.get(factoryType);
    if (!factory) {
      throw new Error(
        `Internal Error: No factory registered for factoryType '${factoryType}'. Did you forget to add it to factoryMap?`,
      );
    }
    const node = factory();
    this.nodes.push(node);
    return node;
  }

  // reorderNode(fromIndex: number, toIndex: number): void {
  //   // const newArray = [...this.nodes]; // create a shallow copy to avoid mutating original
  //   // const [movedItem] = newArray.splice(fromIndex, 1); // remove item
  //   // newArray.splice(toIndex, 0, movedItem); // insert at new index
  //   // this.nodes = newArray;
  //   Node.reorderNode(this.nodes, fromIndex, toIndex);
  // }

  deleteNode(nodeId: string): boolean {
    const nodeList = Node.findNodeList(nodeId, this.nodes);
    if (nodeList) {
      const deleteNode = nodeList.find((n) => n.nodeId === nodeId);
      const deleteIdx = nodeList.indexOf(deleteNode!);
      nodeList.splice(deleteIdx, 1);
      return true;
    }
    return false;
  }

  // Apply domain checks here
  static serialize(formModel: FormModel): FormModelDto {
    const formModelDto: FormModelDto = { ...formModel };
    formModelDto.nodes = (formModel.nodes ?? []).map((n) => Node.serialize(n));
    return formModelDto;
  }

  static deserialize(formModelDto: FormModelDto): FormModel {
    const formModel = new FormModel();
    Object.assign(formModel, formModelDto);
    formModel.nodes = (formModelDto.nodes ?? []).map((n) => Node.deserialize(n));
    return formModel;
  }
}
