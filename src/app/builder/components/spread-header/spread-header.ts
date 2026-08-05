import { Component, computed, inject } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';
import { meetsPublishingRequirements } from 'src/domain/model/spread';

@Component({
  selector: 'app-spread-header',
  imports: [],
  templateUrl: './spread-header.html',
})
export class SpreadHeader {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);

  protected readonly publishRequirementsMet = computed(() => {
    const activeSpread = this.domainStore.activeSpread();
    if (!activeSpread) return false;
    return meetsPublishingRequirements(activeSpread.schema);
  });

  protected openPublishModal(): void {
    if (this.uiStore.spreadSaving() || this.domainStore.activeSnapLoading()) return;
    this.uiStore.showPublishModal();
  }

  protected openRenameModal(): void {
    if (this.uiStore.spreadSaving()) return;
    this.uiStore.showRenameSpreadModal();
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
