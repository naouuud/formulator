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
  protected readonly activeSpread = this.domainStore.activeSpread;
  protected readonly pagesLength = computed(() => this.activeSpread()?.pages.length ?? 0);

  protected readonly activePageIdx = signal<number>(0);
  protected readonly activePage = computed(() => this.activeSpread()?.pages[this.activePageIdx()]);
  protected readonly spreadTitle = computed(() => this.activeSpread()?.title || 'Untitled spread');
  protected readonly pageNumber = computed(() => this.activePageIdx() + 1);
  protected readonly hasMultiplePages = computed(() => this.pagesLength() > 1);
  protected readonly isFirstPage = computed(() => this.activePageIdx() <= 0);
  protected readonly isLastPage = computed(() => this.activePageIdx() >= this.pagesLength() - 1);
  protected readonly pageTitle = computed(() => {
    const page = this.activePage();
    return page?.title?.trim() || `Page ${this.pageNumber()}`;
  });

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
