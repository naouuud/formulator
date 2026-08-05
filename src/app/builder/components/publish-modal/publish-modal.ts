import { Component, effect, inject, signal, untracked } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-publish-modal',
  imports: [],
  templateUrl: './publish-modal.html',
})
export class PublishModal {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);

  protected readonly draftTitle = signal('');

  constructor() {
    effect(() => {
      if (!this.uiStore.publishModal()) return;
      untracked(() => this.draftTitle.set(''));
    });
  }

  protected close(): void {
    this.uiStore.hidePublishModal();
  }

  protected onTitleInput(event: Event): void {
    this.draftTitle.set((event.target as HTMLInputElement).value);
  }

  protected confirmPublish(): void {
    const spreadId = this.domainStore.activeSpread()?.id;
    if (!spreadId || !this.draftTitle().trim()) return;

    this.uiStore.hidePublishModal();
    this.domainStore.createSnap({ spreadId, snapTitle: this.draftTitle() });
  }
}
