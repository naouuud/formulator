import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { DomainStore } from '../../../../../domain/store/domain-store';
import { UiStore } from '../../../../../ui/store/ui-store';
import { RenderedPage } from '../rendered-page/rendered-page';

@Component({
  selector: 'app-rendered-parent',
  imports: [RenderedPage],
  templateUrl: './rendered-parent.html',
})
export class RenderedParent {
  private readonly uiStore = inject(UiStore);
  protected readonly domainStore = inject(DomainStore);
  private readonly activeSpread = this.domainStore.activeSpread;
  private readonly pagesLength = computed(() => this.activeSpread()?.pages.length ?? 0);

  protected readonly activePageIdx = signal<number>(0);
  protected readonly activePage = computed(() => this.activeSpread()?.pages[this.activePageIdx()]);

  protected nextPage(): void {
    if (this.activePageIdx() >= this.pagesLength() - 1) return;
    this.activePageIdx.update((i) => i + 1);
  }

  protected previousPage(): void {
    if (this.activePageIdx() <= 0) return;
    this.activePageIdx.update((i) => i - 1);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.uiStore.closeViewer();
  }
}
