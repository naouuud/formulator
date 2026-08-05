import { Component, effect, inject, signal, untracked } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-rename-spread-modal',
  imports: [],
  templateUrl: './rename-spread-modal.html',
})
export class RenameSpreadModal {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);

  protected readonly submitting = signal(false);
  protected readonly draftTitle = signal('');
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.uiStore.renameSpreadModal()) return;
      untracked(() => {
        const title = this.domainStore.activeSpread()?.spreadTitle ?? '';
        this.draftTitle.set(title);
        this.submitting.set(false);
        this.errorMessage.set(null);
        this.uiStore.clearSpreadSavingError();
      });
    });

    effect(() => {
      if (!this.submitting() || this.uiStore.spreadSaving()) return;

      untracked(() => {
        const saveError = this.uiStore.spreadSavingError();
        if (saveError) {
          if (saveError.code === 409) {
            this.errorMessage.set(
              `Spread '${this.draftTitle()}' already exists. Spread names must be unique across your workspace.`,
            );
          } else {
            this.errorMessage.set(saveError.message);
          }
          this.submitting.set(false);
          return;
        }

        this.uiStore.hideRenameSpreadModal();
        this.submitting.set(false);
      });
    });
  }

  protected close(): void {
    if (this.submitting()) return;
    this.uiStore.hideRenameSpreadModal();
  }

  protected onTitleInput(event: Event): void {
    this.draftTitle.set((event.target as HTMLInputElement).value);
    this.errorMessage.set(null);
  }

  protected confirmRename(): void {
    const spreadTitle = this.draftTitle().trim();
    if (!spreadTitle || this.submitting()) return;

    const current = this.domainStore.activeSpread()?.spreadTitle;
    if (spreadTitle === current) {
      this.uiStore.hideRenameSpreadModal();
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.domainStore.renameSpreadTitle(spreadTitle);
  }
}
