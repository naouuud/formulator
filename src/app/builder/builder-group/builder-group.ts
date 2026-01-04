import { Component, Input } from '@angular/core';
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
export class BuilderGroup {
  @Input() formModel!: FormModel;
  @Input() group!: Group;

  constructor(private builderService: BuilderService) {}

  deleteGroupFromComponent(groupId: string): void {
    const error = this.builderService.deleteGroupFromService(groupId);
    if (error) {
      console.error(error);
    }
  }
}
