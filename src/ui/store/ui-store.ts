import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

type UiState = {
  spreadSaving: boolean;
  spreadSavingError: { message: string; code?: string } | null;
  deletingSpreadId: string | null;
  deleteSpreadError: { message: string; code?: string } | null;
  showJsonViewer: boolean;
  selectedElementId: string | null;
};

const initialState: UiState = {
  spreadSaving: false,
  spreadSavingError: null,
  deletingSpreadId: null,
  deleteSpreadError: null,
  showJsonViewer: false,
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
    toggleJsonViewer(): void {
      patchState(store, { showJsonViewer: !store.showJsonViewer() });
    },
    closeJsonViewer(): void {
      patchState(store, { showJsonViewer: false });
    },
    setSelectedElementId(id: string) {
      patchState(store, { selectedElementId: id });
    },
    clearSelectedElementId() {
      patchState(store, { selectedElementId: null });
    },
  })),
);
