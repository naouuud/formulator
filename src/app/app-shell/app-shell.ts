import { Component, computed, effect, inject, untracked } from '@angular/core';
import { DomainStore } from '../../domain/store/domain-store';
import { AppWorkspace, UiStore } from '../../ui/store/ui-store';
import { CreateSpread } from '../builder/components/create-spread/create-spread';
import { JsonViewer } from '../builder/components/json-viewer/json-viewer';
import { PageCanvas } from '../builder/components/page-canvas/page-canvas';
import { SnapBrowser } from '../share/components/snap-browser/snap-browser';
import { SnapViewer } from '../share/components/snap-viewer/snap-viewer';
import { SpreadHeader } from '../builder/components/spread-header/spread-header';
import { SpreadList } from '../builder/components/spread-list/spread-list';
import { RenderedParent } from '../builder/components/rendered/rendered-parent/rendered-parent';

@Component({
  selector: 'app-shell',
  imports: [
    CreateSpread,
    SpreadList,
    SnapBrowser,
    SpreadHeader,
    PageCanvas,
    JsonViewer,
    RenderedParent,
    SnapViewer,
  ],
  templateUrl: './app-shell.html',
})
export class AppShell {
  protected readonly domainStore = inject(DomainStore);
  protected readonly uiStore = inject(UiStore);
  private readonly activeSpreadId = computed(() => this.domainStore.activeSpread()?.id ?? null);

  constructor() {
    effect(() => {
      this.activeSpreadId();
      untracked(() => {
        this.uiStore.closeViewer();
        this.uiStore.clearSelectedElementId();
      });
    });
  }

  protected setWorkspace(workspace: AppWorkspace): void {
    if (this.uiStore.workspace() === workspace) return;

    this.uiStore.setWorkspace(workspace);

    if (workspace === 'build') {
      this.domainStore.deselectSnap();
    } else {
      this.uiStore.closeViewer();
      this.uiStore.clearSelectedElementId();
      this.domainStore.deselectSpread();
    }
  }
}
