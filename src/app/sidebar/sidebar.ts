import { Component, ViewChild } from '@angular/core';
import { uiTypes } from '../models/ui-types';
import { UiTypeIcon } from '../ui-type-icon/ui-type-icon';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { BuilderModel } from '../services/builder-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [UiTypeIcon, CdkDropList, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  uiTypes = uiTypes;
  // @ViewChild('builderList', { static: true }) builderList!: CdkDropList;

  constructor(private builderModel: BuilderModel) {}
}
