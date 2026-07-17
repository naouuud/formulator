import { Component, effect, inject, signal, untracked } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { DomainStore } from '../../../../domain/store/domain-store';
import { SnapMetaData } from '../../../../domain/model/snap-metadata';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-metadata-list',
  imports: [NgClass, DatePipe],
  templateUrl: './metadata-list.html',
})
export class MetadataList {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  protected readonly openMenuSpreadId = signal<string | null>(null);
  protected readonly openMenuSnapId = signal<string | null>(null);
  readonly #datePipe = new DatePipe('en-US');

  protected sortedSnaps(snaps: SnapMetaData[]): SnapMetaData[] {
    return [...snaps].sort((a, b) => b.edition - a.edition);
  }

  protected snapDisplayName(snap: SnapMetaData): string {
    const date = this.#datePipe.transform(snap.publishedAt, 'MMM d');
    return `#${snap.edition} · ${date}`;
  }

  protected snapStatusLabel(status: SnapMetaData['status']): string {
    return status === 'active' ? 'Live' : 'Closed';
  }

  protected toggleSpreadMenu(spreadId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSpreadId() === spreadId) return;
    this.openMenuSnapId.set(null);
    this.openMenuSpreadId.update((current) => (current === spreadId ? null : spreadId));
  }

  protected toggleSnapMenu(snapId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSnapId() === snapId) return;
    this.openMenuSpreadId.set(null);
    this.openMenuSnapId.update((current) => (current === snapId ? null : snapId));
  }

  protected closeMenus(): void {
    this.openMenuSpreadId.set(null);
    this.openMenuSnapId.set(null);
  }

  protected deleteSpread(spreadId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSpreadId()) return;
    this.closeMenus();
    this.domainStore.deleteSpread(spreadId);
  }

  protected deleteSnap(snapId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSnapId()) return;
    this.closeMenus();
    this.domainStore.deleteSnap(snapId);
  }

  protected selectSnap(snapId: string): void {
    this.closeMenus();
    this.domainStore.loadSnap(snapId);
  }
}
