import { Component } from '@angular/core';
import { Factory, FactoryType } from '../models/factory-types';
import { UiTypeIcon } from '../ui-type-icon/ui-type-icon';
import { CdkDrag, CdkDragMove, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { BuilderService } from '../services/builder-service';

@Component({
  selector: 'app-sidebar',
  imports: [UiTypeIcon, CdkDropList, CdkDrag, CdkDragPlaceholder, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  factoryIconsBasic = Factory.factoryIconsBasic;
  factoryIconsComplex = Factory.factoryIconsComplex;

  constructor(private builderService: BuilderService) {}

  onMove(event: CdkDragMove<FactoryType>) {
    const pos = event.pointerPosition;
    this.builderService.pointerPosition$.set(pos);
  }
}
