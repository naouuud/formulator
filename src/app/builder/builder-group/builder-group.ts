import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group, GroupType } from '../../models/group-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder-service';
import { BuilderField } from '../builder-field/builder-field';
import { BuilderGroupDelete } from '../builder-group-delete/builder-group-delete';
import { OptionListsFloat } from '../option-lists-float/option-lists-float';
import { Option } from '../../models/prop-types';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

const GroupLabels = {
  [GroupType.NONE]: 'None',
  [GroupType.BIRTHDAY]: 'Date of Birth',
  [GroupType.GENDER]: 'Gender',
  [GroupType.PHONE]: 'Phone',
  [GroupType.EMAIL]: 'Email',
  [GroupType.TEXT]: 'Short text',
  [GroupType.TEXTAREA]: 'Long text (e.g. comment, essay)',
  [GroupType.SELECT]: 'Dropdown',
  [GroupType.CHECKBOX]: 'Checkbox <span class="text-xs">(check all that apply)</span>',
  [GroupType.RADIO]: 'Radio <span class="text-xs">(check one option only)</span>',
  [GroupType.DATE]: 'Date',
  [GroupType.NUMBER]: 'Number',
  [GroupType.BOOLEAN]: 'Yes/No',
  [GroupType.NAME]: 'Full Name',
  [GroupType.ADDRESS]: 'Address',
};

@Component({
  selector: 'app-builder-group',
  imports: [CdkDrag, BuilderField, BuilderGroupDelete, OptionListsFloat, ReactiveFormsModule],
  templateUrl: './builder-group.html',
  styleUrl: './builder-group.css',
})
export class BuilderGroup {
  dragDisabled$;
  GroupLabels = GroupLabels;
  GroupType = GroupType;
  @Input() group!: Group;
  @Input() allFormGroupsIn!: FormGroup;
  @Output() groupDeletedEM = new EventEmitter<string[]>();
  floatVisible = false;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  toggleRadioCheckbox_C(): void {
    this.builderService.toggleRadioCheckbox_S(this.group);
  }

  deleteGroup_C(groupId: string): void {
    const fieldIds = this.group.fields.map((f) => f.fieldId); // save fieldIds before deleting to delete formcontrols
    this.builderService.deleteGroup_S(groupId);
    this.groupDeletedEM.emit(fieldIds); // emit to delete formcontrols
  }

  replaceOptions_C(optionList: Option[] | null) {
    if (optionList) this.builderService.replaceOptions_S(this.group, optionList);
    this.floatVisible = false;
  }

  getOptionLists_C(): Option[][] {
    return this.builderService.getOptionLists_S();
  }

  // to bypass typing (allFormGroupsIn.get returns AbstractControl)
  getFormGroup(fieldId: string): FormGroup {
    return this.allFormGroupsIn.get(fieldId) as FormGroup;
  }
}
