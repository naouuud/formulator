import { Component, effect, inject, signal, untracked } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-create-spread-modal',
  imports: [],
  templateUrl: './create-spread-modal.html',
})
export class CreateSpreadModal {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);

  protected readonly draftTitle = signal('');
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.uiStore.createSpreadModal()) return;
      untracked(() => {
        this.draftTitle.set('');
        this.submitting.set(false);
        this.errorMessage.set(null);
      });
    });

    effect(() => {
      if (!this.submitting() || this.domainStore.activeSpreadLoading()) return;

      untracked(() => {
        if (this.domainStore.createSpreadError()) {
          if (this.domainStore.createSpreadError()?.code === 409) {
            this.errorMessage.set(
              'Could not create spread. Choose a different name — spread titles must be unique.',
            );
          } else {
            this.errorMessage.set('Could not create spread. Try again.');
          }

          this.submitting.set(false);
          return;
        }

        this.submitting.set(false);
        this.uiStore.hideCreateSpreadModal();
      });
    });
  }

  protected close(): void {
    if (this.submitting()) return;
    this.uiStore.hideCreateSpreadModal();
  }

  protected onTitleInput(event: Event): void {
    this.draftTitle.set((event.target as HTMLInputElement).value);
    this.errorMessage.set(null);
  }

  protected confirmCreate(): void {
    const spreadTitle = this.draftTitle().trim();
    if (!spreadTitle || this.submitting()) return;

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.domainStore.createSpread(spreadTitle);
  }
}
