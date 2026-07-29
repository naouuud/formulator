import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { DomainStore } from '../../../../domain/store/domain-store';
import { SnapMetaData } from '../../../../domain/model/snap-metadata';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-snap-browser',
  imports: [NgClass, DatePipe],
  templateUrl: './snap-browser.html',
})
export class SnapBrowser {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  protected readonly openMenuSnapId = signal<string | null>(null);
  readonly #datePipe = new DatePipe('en-US');

  protected readonly hasAnySnaps = computed(() => this.domainStore.snapsMetaData().length > 0);

  protected snapDisplayName(snap: SnapMetaData): string {
    const date = this.#datePipe.transform(snap.publishedAt, 'MMM d');
    return `#${snap.edition} · ${date}`;
  }

  protected toggleSnapMenu(snapId: string, event: Event): void {
    event.stopPropagation();
    if (this.uiStore.deletingSnapId() === snapId) return;
    this.openMenuSnapId.update((current) => (current === snapId ? null : snapId));
  }

  protected closeMenus(): void {
    this.openMenuSnapId.set(null);
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
