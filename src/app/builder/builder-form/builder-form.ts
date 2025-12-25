import { Component, ViewChild } from '@angular/core';
import { BuilderModel } from '../../services/builder-model';
import { FormModel } from '../../models/form-model';
import { BuilderGroup } from '../builder-group/builder-group';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-builder-form',
  imports: [BuilderGroup, CdkDropList],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel: FormModel;
  // @ViewChild('sidebarList', { static: true }) sidebarList!: CdkDropList;

  constructor(private builderModel: BuilderModel) {
    this.formModel = this.builderModel.formModel;
  }

  drop(event: CdkDragDrop<any[]>) {
    this.formModel.reorderGroups(event.previousIndex, event.currentIndex);
  }
}
