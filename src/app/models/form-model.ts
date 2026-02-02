import { P } from '@angular/cdk/keycodes';
import { Group, GroupDto, GroupType } from './group-types';

export type FormModelDto = {
  formId: ReturnType<typeof crypto.randomUUID>;
  formName: string;
  groups: GroupDto[];
};

export class FormModel {
  formId = crypto.randomUUID();
  formName: string = '';
  groups: Group[] = [];

  setFormName(value: string): void {
    this.formName = value.trim();
  }

  addGroup(groupType: GroupType): Group {
    const group = Group.create(groupType);
    this.groups.push(group);
    return group;
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

  // Apply domain checks here!
  static serialize(formModel: FormModel) {
    const formModelDto: FormModelDto = { ...formModel };
    formModelDto.groups = (formModel.groups ?? []).map((g: Group) => Group.serialize(g));
    return formModelDto;
  }

  static deserialize(formModelDto: FormModelDto): FormModel {
    const formModel = new FormModel(); // create new form model
    Object.assign(formModel, formModelDto); // copy enumerable properties
    formModel.groups = (formModelDto.groups ?? []).map((g: GroupDto) => Group.deserialize(g)); // initialize new groups
    return formModel;
  }
}
