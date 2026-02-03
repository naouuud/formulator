import { Node, NodeDto, NodeType } from './node';

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

  addNode(nodeType: NodeType): Node {
    const node = Node.create(nodeType);
    this.nodes.push(node);
    return node;
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

// function addNameFields(formModel: FormModel): void {
//   // const group = new Group();
//   // group.groupType = GroupType.NAME;

//   const firstName = Group.create(GroupType.TEXT);
//   const firstNameField = firstName.fields[0];
//   firstNameField.setProp(PropType.LABEL, 'First Name', false);
//   firstNameField.setProp(PropType.PLACEHOLDER, 'Enter first name...');
//   firstNameField.setProp(PropType.REQUIRED, true);
//   firstNameField.setProp(PropType.MAXLENGTHCHAR, 100, false);

//   const lastName = Group.create(GroupType.TEXT);
//   const lastNameField = lastName.fields[0];
//   lastNameField.setProp(PropType.LABEL, 'Last Name', false);
//   lastNameField.setProp(PropType.PLACEHOLDER, 'Enter last name...');
//   lastNameField.setProp(PropType.REQUIRED, true);
//   lastNameField.setProp(PropType.MAXLENGTHCHAR, 100, false);

//   formModel.groups.push(firstName, lastName);
// }
