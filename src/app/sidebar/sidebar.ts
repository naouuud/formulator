import { Component } from '@angular/core';
import { uiTypes } from '../models/ui-types';
import { UiTypeIcon } from '../ui-type-icon/ui-type-icon';
import { CdkDrag, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [UiTypeIcon, CdkDropList, CdkDrag, CdkDragPlaceholder, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  uiTypes = uiTypes;
}
