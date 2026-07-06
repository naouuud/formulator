import { Component, inject } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';

@Component({
  selector: 'app-spread-header',
  imports: [],
  templateUrl: './spread-header.html',
})
export class SpreadHeader {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);

  protected onTitleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.domainStore.updateSpreadTitle(value);
  }
}
