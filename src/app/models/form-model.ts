import { Group, GroupType } from './group-types';

export class FormModel {
  formId: string = crypto.randomUUID();
  formName: string = '';
  groups: Group[] = [];

  setFormName(value: string): void {
    this.formName = value.trim();
  }

  addGroup(groupType: GroupType): void {
    const factory = Group.getFactory(groupType);
    const group = factory();
    this.groups.push(group);
  }

  reorderGroup(fromIndex: number, toIndex: number): void {
    const newArray = [...this.groups]; // create a shallow copy to avoid mutating original
    const [movedItem] = newArray.splice(fromIndex, 1); // remove item
    newArray.splice(toIndex, 0, movedItem); // insert at new index
    this.groups = newArray;
  }

  deleteGroup(groupId: string): void {
    const deleteGroup = this.groups.find((g) => g.groupId === groupId);
    if (deleteGroup === undefined) {
      throw Error(`No group with groupId '${groupId}' found to delete`);
    }
    const deleteIdx = this.groups.indexOf(deleteGroup);
    this.groups.splice(deleteIdx, 1);
  }

  static fromJSON(json: any): FormModel {
    const formModel = new FormModel(); // create new
    Object.assign(formModel, json); // copy properties
    formModel.groups = (json.groups ?? []).map((g: Group) => Group.fromJSON(g)); // initialize new groups
    return formModel;
  }
}
