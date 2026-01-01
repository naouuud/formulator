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

  reorderGroups(fromIndex: number, toIndex: number): void {
    const newArray = [...this.groups]; // create a shallow copy to avoid mutating original
    const [movedItem] = newArray.splice(fromIndex, 1); // remove item
    newArray.splice(toIndex, 0, movedItem); // insert at new index
    this.groups = newArray;
  }
}
