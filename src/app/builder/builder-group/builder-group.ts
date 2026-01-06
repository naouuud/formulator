import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../../models/group-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormModel } from '../../models/form-model';
import { BuilderService } from '../../services/builder-service';

@Component({
  selector: 'app-builder-group',
  imports: [CdkDrag],
  templateUrl: './builder-group.html',
  styleUrl: './builder-group.css',
})
export class BuilderGroup implements OnInit {
  @Input() formModel!: FormModel;
  @Input() group!: Group;

  constructor(private builderService: BuilderService) {}
  ngOnInit(): void {
    console.log(this.group);
  }

  deleteGroupFromComponent(groupId: string): void {
    const error = this.builderService.deleteGroupFromService(groupId);
  }
}
