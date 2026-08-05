import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export type AppWorkspace = 'build' | 'share';

export type SnapViewerTab = 'share' | 'currentShares' | 'preview';

type UiState = {
  workspace: AppWorkspace;
  snapViewerTab: SnapViewerTab;
  spreadSaving: boolean;
  spreadSavingError: { message: string; code?: number } | null;

  deletingSpreadId: string | null;
  deleteSpreadError: { message: string; code?: number } | null;

  deletingSnapId: string | null;
  deleteSnapError: { message: string; code?: number } | null;

  viewer: 'json' | 'rendered' | null;
  selectedElementId: string | null;

  publishModal: boolean;
  createSpreadModal: boolean;
  renameSpreadModal: boolean;
};

const initialState: UiState = {
  workspace: 'build',
  snapViewerTab: 'currentShares',
  spreadSaving: false,
  spreadSavingError: null,

  deletingSpreadId: null,
  deleteSpreadError: null,

  deletingSnapId: null,
  deleteSnapError: null,

  viewer: null,
  selectedElementId: null,

  publishModal: false,
  createSpreadModal: false,
  renameSpreadModal: false,
};

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setWorkspace(workspace: AppWorkspace): void {
      patchState(store, { workspace });
    },
    setSnapViewerTab(tab: SnapViewerTab): void {
      patchState(store, { snapViewerTab: tab });
    },
    startSpreadSaving(): void {
      patchState(store, { spreadSaving: true });
    },
    stopSpreadSaving(): void {
      patchState(store, { spreadSaving: false });
    },
    setSpreadSavingError(message: string, code?: number): void {
      patchState(store, { spreadSavingError: { message, code } });
    },
    clearSpreadSavingError(): void {
      patchState(store, { spreadSavingError: null });
    },
    setDeleteSpreadError(message: string, code?: number): void {
      patchState(store, { deleteSpreadError: { message, code } });
    },
    clearDeleteSpreadError(): void {
      patchState(store, { deleteSpreadError: null });
    },
    startDeletingSpread(id: string): void {
      patchState(store, { deletingSpreadId: id });
    },
    stopDeletingSpread(): void {
      patchState(store, { deletingSpreadId: null });
    },
    setJsonViewer(): void {
      patchState(store, { viewer: 'json' });
    },
    setRenderedViewer(): void {
      patchState(store, { viewer: 'rendered' });
    },
    closeViewer(): void {
      patchState(store, { viewer: null });
    },
    setSelectedElementId(id: string) {
      patchState(store, { selectedElementId: id });
    },
    clearSelectedElementId() {
      patchState(store, { selectedElementId: null });
    },
    startDeletingSnap(id: string): void {
      patchState(store, { deletingSnapId: id });
    },
    stopDeletingSnap(): void {
      patchState(store, { deletingSnapId: null });
    },
    setDeleteSnapError(message: string, code?: number): void {
      patchState(store, { deleteSnapError: { message, code } });
    },
    clearDeleteSnapError(): void {
      patchState(store, { deleteSnapError: null });
    },
    showPublishModal(): void {
      patchState(store, { publishModal: true });
    },
    hidePublishModal(): void {
      patchState(store, { publishModal: false });
    },
    showCreateSpreadModal(): void {
      patchState(store, { createSpreadModal: true });
    },
    hideCreateSpreadModal(): void {
      patchState(store, { createSpreadModal: false });
    },
    showRenameSpreadModal(): void {
      patchState(store, { renameSpreadModal: true });
    },
    hideRenameSpreadModal(): void {
      patchState(store, { renameSpreadModal: false });
    },
  })),
);
