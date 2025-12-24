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
    this.addGroup(group);
    return group;
  }
}
