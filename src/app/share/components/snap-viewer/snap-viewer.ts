import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { RenderedPage } from '../../../builder/components/rendered/rendered-page/rendered-page';
import { SpillList } from '../spill-list/spill-list';

type SnapTab = 'preview' | 'spills';

@Component({
  selector: 'app-snap-viewer',
  imports: [DatePipe, RenderedPage, SpillList],
  templateUrl: './snap-viewer.html',
})
export class SnapViewer {
  protected readonly domainStore = inject(DomainStore);

  protected readonly snap = computed(() => this.domainStore.activeSnap());
  protected readonly schema = computed(() => this.snap()?.schema);
  protected readonly pages = computed(() => this.schema()?.pages ?? []);
  protected readonly title = computed(() => this.schema()?.title?.trim() || 'Untitled edition');

  protected readonly tab = signal<SnapTab>('preview');
  protected readonly activePageIdx = signal(0);

  protected readonly activePage = computed(() => this.pages()[this.activePageIdx()]);
  protected readonly pageCount = computed(() => this.pages().length);
  protected readonly pageNumber = computed(() => this.activePageIdx() + 1);
  protected readonly hasMultiplePages = computed(() => this.pageCount() > 1);
  protected readonly isFirstPage = computed(() => this.activePageIdx() <= 0);
  protected readonly isLastPage = computed(() => this.activePageIdx() >= this.pageCount() - 1);
  protected readonly pageTitle = computed(
    () => this.activePage()?.title?.trim() || `Page ${this.pageNumber()}`,
  );

  constructor() {
    effect(() => {
      this.snap()?.id;
      untracked(() => {
        this.activePageIdx.set(0);
        this.tab.set('preview');
      });
    });
  }

  protected setTab(tab: SnapTab): void {
    this.tab.set(tab);
  }

  protected nextPage(): void {
    if (this.isLastPage()) return;
    this.activePageIdx.update((i) => i + 1);
  }

  protected previousPage(): void {
    if (this.isFirstPage()) return;
    this.activePageIdx.update((i) => i - 1);
  }
}
