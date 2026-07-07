import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

type UiState = {
  spreadSaving: boolean;
  spreadSavingError: { message: string; code?: string } | null;
  showJsonViewer: boolean;
};

const initialState: UiState = {
  spreadSaving: false,
  spreadSavingError: null,
  showJsonViewer: false,
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
    toggleJsonViewer(): void {
      patchState(store, { showJsonViewer: !store.showJsonViewer() });
    },
    closeJsonViewer(): void {
      patchState(store, { showJsonViewer: false });
    },
  })),
);
