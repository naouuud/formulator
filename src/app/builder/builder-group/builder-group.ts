import { Component, Input, Output } from '@angular/core';
import { Group, GroupType } from '../../models/group-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder-service';
import { BuilderField } from '../builder-field/builder-field';
import { BuilderGroupDelete } from '../builder-group-delete/builder-group-delete';
import { Subject } from 'rxjs';
import { OptionListsFloat } from '../option-lists-float/option-lists-float';
import { Option } from '../../models/field-types';

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
  imports: [CdkDrag, BuilderField, BuilderGroupDelete, OptionListsFloat],
  templateUrl: './builder-group.html',
  styleUrl: './builder-group.css',
})
export class BuilderGroup {
  dragDisabled$;
  GroupLabels = GroupLabels;
  GroupType = GroupType;
  @Input() group!: Group;
  @Output() groupDeleted = new Subject<void>();
  floatVisible = false;

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  toggleRadioCheckbox_C(): void {
    this.builderService.toggleRadioCheckbox_S(this.group);
  }

  deleteGroup_C(groupId: string): void {
    this.builderService.deleteGroup_S(groupId);
    this.groupDeleted.next();
  }

  replaceOptions_C(optionList: Option[] | null) {
    if (optionList) this.builderService.replaceOptions_S(this.group, optionList);
    this.floatVisible = false;
  }

  getOptionLists_C(): Option[][] {
    return this.builderService.getOptionLists_S();
  }
}
