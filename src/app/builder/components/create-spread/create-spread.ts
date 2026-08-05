import { Component, inject } from '@angular/core';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-create-spread',
  imports: [],
  templateUrl: './create-spread.html',
})
export class CreateSpread {
  protected readonly uiStore = inject(UiStore);

  protected openCreateSpreadModal(): void {
    this.uiStore.showCreateSpreadModal();
  }
}
