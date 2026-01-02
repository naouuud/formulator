import { Component } from '@angular/core';
import { BuilderModel } from '../../services/builder-model';
import { FormModel } from '../../models/form-model';
import { BuilderGroup } from '../builder-group/builder-group';
import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { GroupType } from '../../models/group-types';

@Component({
  selector: 'app-builder-form',
  imports: [BuilderGroup, DragDropModule, CdkDropList],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel: FormModel;

  constructor(private builderService: BuilderModel) {
    this.formModel = this.builderService.formModel;
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) this._reorder(event);
    else this._createGroup(event);
  }

  private _reorder(event: CdkDragDrop<undefined>) {
    // console.log("reorder", event)
    this.builderService.formModel.reorderGroups(event.previousIndex, event.currentIndex);
  }

  private _createGroup(event: CdkDragDrop<GroupType>) {
    // console.log("create", event)
    const groupType: GroupType = event.item.data;
    this.builderService.createGroup(groupType);
    this.builderService.formModel.reorderGroups(
      this.builderService.formModel.groups.length - 1,
      event.currentIndex
    );
  }
}
