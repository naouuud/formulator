import { Component, computed, effect, inject, untracked } from '@angular/core';
import { DomainStore } from '../../domain/store/domain-store';
import { AppWorkspace, UiStore } from '../../ui/store/ui-store';
import { JsonViewer } from '../builder/components/json-viewer/json-viewer';
import { PageCanvas } from '../builder/components/page-canvas/page-canvas';
import { SnapBrowser } from '../share/components/snap-browser/snap-browser';
import { SnapViewer } from '../share/components/snap-viewer/snap-viewer';
import { SpreadHeader } from '../builder/components/spread-header/spread-header';
import { SpreadList } from '../builder/components/spread-list/spread-list';
import { RenameSpreadModal } from '../builder/components/rename-spread-modal/rename-spread-modal';
import { CreateSpreadModal } from '../builder/components/create-spread-modal/create-spread-modal';
import { PublishModal } from '../builder/components/publish-modal/publish-modal';
import { RenderedParent } from '../builder/components/rendered/rendered-parent/rendered-parent';

@Component({
  selector: 'app-shell',
  imports: [
    SpreadList,
    SnapBrowser,
    SpreadHeader,
    PageCanvas,
    JsonViewer,
    RenderedParent,
    SnapViewer,
    PublishModal,
    CreateSpreadModal,
    RenameSpreadModal,
  ],
  templateUrl: './app-shell.html',
})
export class AppShell {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  private readonly activeSpreadId = computed(() => this.domainStore.activeSpread()?.id ?? null);
  private readonly activeSnapId = computed(() => this.domainStore.activeSnap()?.id ?? null);

  constructor() {
    effect(() => {
      this.activeSpreadId();
      untracked(() => {
        this.uiStore.closeViewer();
        this.uiStore.clearSelectedElementId();
        this.uiStore.hidePublishModal();
        this.uiStore.hideCreateSpreadModal();
        this.uiStore.hideRenameSpreadModal();
      });
    });

    this.domainStore.loadSpillsMetaData(this.activeSnapId);
  }

  protected setWorkspace(workspace: AppWorkspace): void {
    if (this.uiStore.workspace() === workspace) return;

    this.uiStore.setWorkspace(workspace);
  }
}
