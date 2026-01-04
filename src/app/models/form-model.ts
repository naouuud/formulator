import { Group } from './group-types';

export class FormModel {
  formId: string = crypto.randomUUID();
  formName: string = '';
  groups: Group[] = [];

  setFormName(value: string): void {
    this.formName = value;
  }

  addGroup(...group: Group[]): void {
    this.groups.push(...group);
  }

  reorderGroup(fromIndex: number, toIndex: number): void {
    const newArray = [...this.groups]; // create a shallow copy to avoid mutating original
    const [movedItem] = newArray.splice(fromIndex, 1); // remove item
    newArray.splice(toIndex, 0, movedItem); // insert at new index
    this.groups = newArray;
  }

  deleteGroup(groupId: string): Error | void {
    const deleteGroup = this.groups.find((g) => g.groupId === groupId);
    if (deleteGroup === undefined) {
      return new Error(`No group with groupId "${groupId}" found to delete`);
    }
    const deleteIdx = this.groups.indexOf(deleteGroup);
    this.groups.splice(deleteIdx, 1);
  }
}
