import { Component, computed } from '@angular/core';
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
  basic = Factory.basic;
  basic_F = Factory.basic_F;
  complex = Factory.complex;
  complex_F = Factory.complex_F;
  groupIds$;
  groupDropIds$ = computed(() => {
    const groupIds = this.groupIds$();
    return groupIds.map((id) => `group-drop-${id}`);
  });

  constructor(private builderService: BuilderService) {
    this.groupIds$ = this.builderService.groupIds$;
  }

  onMove(event: CdkDragMove<FactoryType>) {
    const pos = event.pointerPosition;
    this.builderService.pointerPosition$.set(pos);
  }
}
