import { Component, inject } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-spread-header',
  imports: [],
  templateUrl: './spread-header.html',
})
export class SpreadHeader {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);

  protected onTitleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.domainStore.updateSpreadTitle(value);
  }

  protected saveSpread(): void {
    const spread = this.domainStore.activeSpread();
    if (spread) {
      this.domainStore.saveSpread(spread);
    }
  }

  protected createSnap(): void {
    if (this.uiStore.spreadSaving() || this.domainStore.activeSnapLoading()) return;
    const spreadId = this.domainStore.activeSpread()?.id;
    if (spreadId) this.domainStore.createSnap(spreadId);
  }

  protected toggleJsonViewer(): void {
    const current = this.uiStore.viewer();
    if (current === 'json') {
      this.uiStore.closeViewer();
    } else {
      this.uiStore.setJsonViewer();
    }
  }

  protected toggleRenderedView(): void {
    const current = this.uiStore.viewer();
    if (current === 'rendered') {
      this.uiStore.closeViewer();
    } else {
      this.uiStore.setRenderedViewer();
    }
  }
}
