import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';
import { CreateSpread } from '../create-spread/create-spread';

@Component({
  selector: 'app-spread-list',
  imports: [NgClass, CreateSpread],
  templateUrl: './spread-list.html',
})
export class SpreadList {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  protected readonly openMenuSpreadId = signal<string | null>(null);

  protected toggleSpreadMenu(spreadId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSpreadId() === spreadId) return;
    this.openMenuSpreadId.update((current) => (current === spreadId ? null : spreadId));
  }

  protected closeMenus(): void {
    this.openMenuSpreadId.set(null);
  }

  protected deleteSpread(spreadId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSpreadId()) return;
    this.closeMenus();
    this.domainStore.deleteSpread(spreadId);
  }
}
