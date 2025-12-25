import { Group, groupMap, GroupType } from './group-types';

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

  createGroup(groupType: GroupType): Group | undefined {
    const factory = groupMap.get(groupType);
    if (!factory) return;
    const group = factory();
    this.groups.push(group);
    return group;
  }

  reorderGroups(fromIndex: number, toIndex: number): void {
    const newArray = [...this.groups]; // create a shallow copy to avoid mutating original
    const [movedItem] = newArray.splice(fromIndex, 1); // remove item
    newArray.splice(toIndex, 0, movedItem); // insert at new index
    this.groups = newArray;
  }
}
