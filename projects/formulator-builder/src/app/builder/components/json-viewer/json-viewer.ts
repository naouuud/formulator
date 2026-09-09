import { Component, computed, HostListener, inject } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-json-viewer',
  imports: [],
  templateUrl: './json-viewer.html',
})
export class JsonViewer {
  protected readonly domainStore = inject(DomainStore);
  private readonly uiStore = inject(UiStore);

  protected readonly json = computed(() => {
    const spread = this.domainStore.activeSpread();
    if (!spread) return '';
    return JSON.stringify(spread.schema, null, 2);
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.uiStore.closeViewer();
  }
}
