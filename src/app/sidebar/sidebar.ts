import { Component, computed, effect, signal } from '@angular/core';
import { Factory, FactoryType } from '../models/factory-types';
import { UiTypeIcon } from '../ui-type-icon/ui-type-icon';
import {
  CdkDrag,
  CdkDragMove,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormRepoLocal } from '../services/form-repo-local';

@Component({
  selector: 'app-sidebar',
  imports: [UiTypeIcon, CdkDropList, CdkDrag, CdkDragPlaceholder, CommonModule, CdkDropListGroup],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  basic = Factory.basic;
  basic_F = Factory.basic_F;
  complex = Factory.complex;
  complex_F = Factory.complex_F;
  groupIds$;
  dropListIds$ = computed(() => {
    const groupIds = this.groupIds$();
    return ['form-drop'].concat(groupIds.map((id) => `group-drop-${id}`));
  });

  constructor(private builderService: FormRepoLocal) {
    this.groupIds$ = this.builderService.groupIds$;
  }

  onMove(event: CdkDragMove<FactoryType>) {
    const pos = event.pointerPosition;
    this.builderService.pointerPosition$.set(pos);
  }
}
