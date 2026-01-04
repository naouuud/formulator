import { Component } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { FormModel } from '../../models/form-model';
import { BuilderGroup } from '../builder-group/builder-group';
import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { GroupType } from '../../models/group-types';
import { BuilderFormTitle } from '../builder-form-title/builder-form-title';

@Component({
  selector: 'app-builder-form',
  imports: [BuilderGroup, DragDropModule, CdkDropList, BuilderFormTitle],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel: FormModel;

  constructor(private builderService: BuilderService) {
    this.formModel = this.builderService.formModel;
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) this._reorderGroupFromComponent(event);
    else this._addGroupFromComponent(event);
  }

  private _reorderGroupFromComponent(event: CdkDragDrop<undefined>) {
    this.builderService.reorderGroupFromService(event.previousIndex, event.currentIndex);
  }

  private _addGroupFromComponent(event: CdkDragDrop<GroupType>) {
    const groupType: GroupType = event.item.data;
    this.builderService.addGroupFromService(groupType);
    this.builderService.reorderGroupFromService(
      this.builderService.formModel.groups.length - 1,
      event.currentIndex
    );
  }
}
