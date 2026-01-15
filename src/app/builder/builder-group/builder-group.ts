import { Component, Input, OnInit, Output } from '@angular/core';
import { Group, GroupType } from '../../models/group-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder-service';
import { BuilderField } from '../builder-field/builder-field';
import { BuilderGroupDelete } from '../builder-group-delete/builder-group-delete';
import { Subject } from 'rxjs';

const GroupLabels = {
  [GroupType.BIRTHDAY]: 'Date of Birth',
  [GroupType.GENDER]: 'Gender',
  [GroupType.PHONE]: 'Phone',
  [GroupType.EMAIL]: 'Email',
  [GroupType.TEXT]: 'Short text',
  [GroupType.TEXTAREA]: 'Long text (e.g. comment, essay)',
  [GroupType.SELECT]: 'Dropdown',
  [GroupType.CHECKBOX]: 'Checkbox (check all that apply)',
  [GroupType.RADIO]: 'Radio (check one option only)',
  [GroupType.DATE]: 'Date',
  [GroupType.NUMBER]: 'Number',
  [GroupType.BOOLEAN]: 'Yes/No',
  [GroupType.NAME]: 'Full Name',
  [GroupType.ADDRESS]: 'Address',
};

@Component({
  selector: 'app-builder-group',
  imports: [CdkDrag, BuilderField, BuilderGroupDelete],
  templateUrl: './builder-group.html',
  styleUrl: './builder-group.css',
})
export class BuilderGroup implements OnInit {
  dragDisabled$;
  GroupLabels = GroupLabels;
  @Input() group!: Group;
  @Output() groupDeleted = new Subject<void>();

  constructor(private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }
  ngOnInit(): void {
    // console.log(this.group);
  }

  deleteGroup_C(groupId: string): void {
    this.builderService.deleteGroup_S(groupId);
    this.groupDeleted.next();
  }
}
