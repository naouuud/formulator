import { Component, computed, effect, inject, untracked } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { UiStore } from '../../../../ui/store/ui-store';
import { CreateSpread } from '../create-spread/create-spread';
import { JsonViewer } from '../json-viewer/json-viewer';
import { MetadataList } from '../metadata-list/metadata-list';
import { PageCanvas } from '../page-canvas/page-canvas';
import { SpreadHeader } from '../spread-header/spread-header';

@Component({
  selector: 'app-builder-parent',
  imports: [CreateSpread, MetadataList, SpreadHeader, PageCanvas, JsonViewer],
  templateUrl: './builder-parent.html',
})
export class BuilderParent {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  private readonly activeSpreadId = computed(() => this.domainStore.activeSpread()?.id ?? null);

  constructor() {
    effect(() => {
      this.activeSpreadId();
      untracked(() => this.uiStore.closeJsonViewer());
    });
  }
}
