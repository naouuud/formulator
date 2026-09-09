import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { SnapViewerTab, UiStore } from '../../../../ui/store/ui-store';
import { RenderedPage } from '../../../builder/components/rendered/rendered-page/rendered-page';
import { SnapStatus } from '../../../../domain/model/snap';
import { SpillMetaData } from '../../../../domain/model/spill-metadata';
import { ShareSurvey } from '../share-survey/share-survey';

@Component({
  selector: 'app-snap-viewer',
  imports: [DatePipe, NgClass, RenderedPage, ShareSurvey],
  templateUrl: './snap-viewer.html',
})
export class SnapViewer {
  private static readonly SHARE_SUCCESS_MS = 5_000;

  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  private readonly destroyRef = inject(DestroyRef);

  private shareSuccessTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly snap = computed(() => this.domainStore.activeSnap());
  protected readonly schema = computed(() => this.snap()?.schema);
  protected readonly pages = computed(() => this.schema()?.pages ?? []);
  protected readonly title = computed(() => this.schema()?.title?.trim() || 'Untitled edition');

  protected readonly tab = this.uiStore.snapViewerTab;
  protected readonly activePageIdx = signal(0);
  protected readonly shareSuccessMessage = signal<string | null>(null);

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
    this.destroyRef.onDestroy(() => this.clearShareSuccessTimeout());

    effect(() => {
      this.snap()?.id;
      untracked(() => {
        this.activePageIdx.set(0);
        this.hideShareSuccessMessage();
        this.domainStore.clearDeleteSpillError();
      });
    });

    effect(() => {
      this.uiStore.snapViewerTab();
      untracked(() => this.activePageIdx.set(0));
    });

    effect(() => {
      const loading = this.domainStore.createSpillsLoading();
      const count = this.domainStore.createSpillsSuccessCount();
      const error = this.domainStore.createSpillsError();

      if (loading) {
        untracked(() => this.hideShareSuccessMessage());
        return;
      }

      if (count === null || error) return;

      untracked(() => {
        this.showShareSuccessMessage(
          count === 1
            ? '1 survey share sent successfully.'
            : `${count} survey shares sent successfully.`,
        );
        this.uiStore.setSnapViewerTab('currentShares');
      });
    });

    effect(() => {
      this.uiStore.workspace();
      untracked(() => this.hideShareSuccessMessage());
    });
  }

  private showShareSuccessMessage(message: string): void {
    this.clearShareSuccessTimeout();
    this.shareSuccessMessage.set(message);
    this.shareSuccessTimeout = setTimeout(() => {
      this.shareSuccessTimeout = null;
      this.shareSuccessMessage.set(null);
    }, SnapViewer.SHARE_SUCCESS_MS);
  }

  private hideShareSuccessMessage(): void {
    this.clearShareSuccessTimeout();
    this.shareSuccessMessage.set(null);
  }

  private clearShareSuccessTimeout(): void {
    if (this.shareSuccessTimeout === null) return;
    clearTimeout(this.shareSuccessTimeout);
    this.shareSuccessTimeout = null;
  }

  protected setTab(tab: SnapViewerTab): void {
    this.uiStore.setSnapViewerTab(tab);
  }

  protected dismissShareSuccess(): void {
    this.hideShareSuccessMessage();
  }

  protected dismissDeleteSpillError(): void {
    this.domainStore.clearDeleteSpillError();
  }

  protected deleteSpill(spillId: string): void {
    if (this.domainStore.deletingSpillId()) return;
    this.domainStore.deleteSpill(spillId);
  }

  protected isDeletingSpill(spillId: string): boolean {
    return this.domainStore.deletingSpillId() === spillId;
  }

  protected nextPage(): void {
    if (this.isLastPage()) return;
    this.activePageIdx.update((i) => i + 1);
  }

  protected previousPage(): void {
    if (this.isFirstPage()) return;
    this.activePageIdx.update((i) => i - 1);
  }

  protected displayName(spill: SpillMetaData): string {
    const name = [spill.firstName, spill.lastName].filter(Boolean).join(' ').trim();
    return name || spill.email;
  }

  protected statusLabel(spill: SpillMetaData): string {
    if (spill.completedAt) return 'Complete';
    if (spill.expiredAt) return 'Expired';
    const now = new Date();
    if (spill.sentAt > now) {
      return 'Scheduled';
    }
    return 'Active';
  }

  protected snapStatusLabel(status: SnapStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  protected statusClass(spill: SpillMetaData): string {
    const status = this.statusLabel(spill);
    const base =
      'inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide';
    if (status === 'Complete') return `${base} bg-emerald-50 text-emerald-700`;
    if (status === 'Expired') return `${base} bg-slate-100 text-slate-500`;
    if (status === 'Scheduled') return `${base} bg-amber-50 text-amber-700`;
    return `${base} bg-sky-50 text-sky-700`;
  }
}
