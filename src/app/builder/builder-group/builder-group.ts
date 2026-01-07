import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../../models/group-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder-service';
import { BuilderField } from '../builder-field/builder-field';
import { BuilderGroupDelete } from '../builder-group-delete/builder-group-delete';

@Component({
  selector: 'app-builder-group',
  imports: [CdkDrag, BuilderField, BuilderGroupDelete],
  templateUrl: './builder-group.html',
  styleUrl: './builder-group.css',
})
export class BuilderGroup implements OnInit {
  // @Input() formModel!: FormModel;
  @Input() group!: Group;

  constructor(private builderService: BuilderService) {}
  ngOnInit(): void {
    console.log(this.group);
  }

  deleteGroup_C(groupId: string): void {
    const error = this.builderService.deleteGroup_S(groupId);
  }
}
