import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

type UiState = {
  spreadSaving: boolean;
  spreadSavingError: { message: string; code?: string } | null;
  deletingSpreadId: string | null;
  deleteSpreadError: { message: string; code?: string } | null;
  viewer: 'json' | 'rendered' | null;
  selectedElementId: string | null;
};

const initialState: UiState = {
  spreadSaving: false,
  spreadSavingError: null,
  deletingSpreadId: null,
  deleteSpreadError: null,
  viewer: null,
  selectedElementId: null,
};

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
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
  })),
);
