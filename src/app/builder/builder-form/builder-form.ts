import { Component, signal, Signal } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { FormModel } from '../../models/form-model';
import { BuilderGroup } from '../builder-group/builder-group';
import { CdkDragDrop, CdkDragEnter, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { GroupType } from '../../models/group-types';
import { BuilderFormTitle } from '../builder-form-title/builder-form-title';

@Component({
  selector: 'app-builder-form',
  imports: [BuilderGroup, DragDropModule, CdkDropList, BuilderFormTitle],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel;
  hideMessage = signal(false);

  constructor(private builderService: BuilderService) {
    this.formModel = this.builderService.formModel;
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      this._reorderGroup_C(event);
    } else {
      this._addGroup_C(event);
    }
  }

  private _reorderGroup_C(event: CdkDragDrop<unknown>) {
    this.builderService.reorderGroup_S(event.previousIndex, event.currentIndex);
  }

  private _addGroup_C(event: CdkDragDrop<GroupType>) {
    const groupType: GroupType = event.item.data;
    this.builderService.addGroup_S(groupType);
    this.builderService.reorderGroup_S(this.formModel.groups.length - 1, event.currentIndex);
  }
}
