import { Component, Input, OnInit, Output } from '@angular/core';
import { Group, GroupLabels } from '../../models/group-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder-service';
import { BuilderField } from '../builder-field/builder-field';
import { BuilderGroupDelete } from '../builder-group-delete/builder-group-delete';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-builder-group',
  imports: [CdkDrag, BuilderField, BuilderGroupDelete],
  templateUrl: './builder-group.html',
  styleUrl: './builder-group.css',
})
export class BuilderGroup implements OnInit {
  // @Input() formModel!: FormModel;
  GroupLabels = GroupLabels;
  @Input() group!: Group;
  @Output() groupDeleted = new Subject<void>();

  constructor(private builderService: BuilderService) {}
  ngOnInit(): void {
    // console.log(this.group);
  }

  deleteGroup_C(groupId: string): void {
    this.builderService.deleteGroup_S(groupId);
    this.groupDeleted.next();
  }
}
