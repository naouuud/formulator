import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-metadata-list',
  imports: [NgClass],
  templateUrl: './metadata-list.html',
})
export class MetadataList {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  protected readonly openMenuSpreadId = signal<string | null>(null);

  protected toggleMenu(spreadId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSpreadId() === spreadId) return;
    this.openMenuSpreadId.update((current) => (current === spreadId ? null : spreadId));
  }

  protected closeMenu(): void {
    this.openMenuSpreadId.set(null);
  }

  protected deleteSpread(spreadId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSpreadId()) return;
    this.closeMenu();
    this.domainStore.deleteSpread(spreadId);
  }
}
