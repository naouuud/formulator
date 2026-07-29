import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export type AppWorkspace = 'build' | 'share';

type UiState = {
  workspace: AppWorkspace;
  spreadSaving: boolean;
  spreadSavingError: { message: string; code?: string } | null;

  deletingSpreadId: string | null;
  deleteSpreadError: { message: string; code?: string } | null;

  deletingSnapId: string | null;
  deleteSnapError: { message: string; code?: string } | null;

  viewer: 'json' | 'rendered' | null;
  selectedElementId: string | null;
};

const initialState: UiState = {
  workspace: 'build',
  spreadSaving: false,
  spreadSavingError: null,

  deletingSpreadId: null,
  deleteSpreadError: null,

  deletingSnapId: null,
  deleteSnapError: null,

  viewer: null,
  selectedElementId: null,
};

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setWorkspace(workspace: AppWorkspace): void {
      patchState(store, { workspace });
    },
    startSpreadSaving(): void {
      patchState(store, { spreadSaving: true });
    },
    stopSpreadSaving(): void {
      patchState(store, { spreadSaving: false });
    },
    setSpreadSavingError(message: string, code?: string): void {
      patchState(store, { spreadSavingError: { message, code } });
    },
    clearSpreadSavingError(): void {
      patchState(store, { spreadSavingError: null });
    },
    setDeleteSpreadError(message: string, code?: string): void {
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
    setDeleteSnapError(message: string, code?: string): void {
      patchState(store, { deleteSnapError: { message, code } });
    },
    clearDeleteSnapError(): void {
      patchState(store, { deleteSnapError: null });
    },
  })),
);
