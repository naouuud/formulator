import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import {
  CreateElementParams,
  meetsPublishingRequirements,
  newElement,
  newOption,
  newPage,
} from '@formulator/schema';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { produce } from 'immer';
import {
  catchError,
  concatMap,
  debounceTime,
  EMPTY,
  exhaustMap,
  finalize,
  forkJoin,
  Observable,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { SnapService } from 'src/external/api/snap.service';
import { SpreadService } from '../../external/api/spread.service';
import { UiStore } from '../../ui/store/ui-store';
import { Snap } from '../model/snap';
import { SnapMetaData, toSnapMetaData } from '../model/snap-metadata';
import { Spread } from '../model/spread';
import { SpreadMetaData, toSpreadMetaData, updateMetaData } from '../model/spread-metadata';
import { User } from '../model/user';

type DomainState = {
  user: User | null;

  spreadsMetaData: SpreadMetaData[];
  snapsMetaData: SnapMetaData[];
  metaDataLoading: boolean;
  loadSpreadsMetaDataError: boolean;
  loadSnapsMetaDataError: boolean;

  activeSpread: Spread | null;
  activeSpreadLoading: boolean;
  loadSpreadError: boolean;
  activePageIdx: number;

  activeSnap: Snap | null;
  activeSnapLoading: boolean;
  loadSnapError: boolean;

  createSpreadError: boolean;
  createSnapError: boolean;
};

const initialState: DomainState = {
  user: null,

  spreadsMetaData: [],
  snapsMetaData: [],
  metaDataLoading: false,
  loadSpreadsMetaDataError: false,
  loadSnapsMetaDataError: false,

  activeSpread: null,
  activeSpreadLoading: false,
  loadSpreadError: false,
  activePageIdx: 0,

  activeSnap: null,
  activeSnapLoading: false,
  loadSnapError: false,

  createSpreadError: false,
  createSnapError: false,
};

export const DomainStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((state) => ({
    activePage: computed(() => state.activeSpread()?.schema.pages[state.activePageIdx()]),
    activeView: computed<'spread' | 'snap' | null>(() =>
      state.activeSnap() ? 'snap' : state.activeSpread() ? 'spread' : null,
    ),
    metaData: computed(() =>
      state.spreadsMetaData().map((spread) => ({
        ...spread,
        snaps: state.snapsMetaData().filter((snap) => snap.spreadId === spread.id),
      })),
    ),
  })),

  withMethods(
    (
      store,
      spreadService = inject(SpreadService),
      snapService = inject(SnapService),
      uiStore = inject(UiStore),
    ) => {
      const performSave = (spread: Spread): Observable<Spread> => {
        return spreadService.update(spread).pipe(
          tap((updated) => {
            patchState(store, {
              spreadsMetaData: updateMetaData(store.spreadsMetaData(), updated),
            });
            const current = store.activeSpread();
            if (!current || current.id !== updated.id) {
              uiStore.stopSpreadSaving();
              return;
            }
            const merged: Spread = {
              ...current,
              version: updated.version,
              lastModifiedAt: updated.lastModifiedAt,
            };
            patchState(store, {
              activeSpread: merged,
            });
            uiStore.stopSpreadSaving();
          }),
          catchError((err: HttpErrorResponse) => {
            uiStore.stopSpreadSaving();
            uiStore.setSpreadSavingError(err.message, String(err.status));
            return EMPTY;
          }),
        );
      };

      const triggerAutoSave = rxMethod<Spread>(
        pipe(
          debounceTime(1500),
          tap(() => {
            uiStore.startSpreadSaving();
            uiStore.clearSpreadSavingError();
          }),
          switchMap((spread) => performSave(spread)),
        ),
      );

      const loadSpreadsMetaData = () =>
        spreadService.getAll().pipe(
          tap((metaData) => {
            patchState(store, {
              spreadsMetaData: metaData,
              loadSpreadsMetaDataError: false,
            });
          }),
          catchError((err: HttpErrorResponse) => {
            patchState(store, {
              loadSpreadsMetaDataError: true,
            });
            return EMPTY;
          }),
        );

      const loadSnapsMetaData = () =>
        snapService.getAll().pipe(
          tap((metadata) =>
            patchState(store, {
              snapsMetaData: metadata,
              loadSnapsMetaDataError: false,
            }),
          ),
          catchError((err: HttpErrorResponse) => {
            patchState(store, { loadSnapsMetaDataError: true });
            return EMPTY;
          }),
        );

      return {
        loadMetaData: rxMethod<void>(
          pipe(
            tap(() => {
              patchState(store, { metaDataLoading: true });
            }),
            switchMap(() =>
              forkJoin([loadSpreadsMetaData(), loadSnapsMetaData()]).pipe(
                finalize(() => patchState(store, { metaDataLoading: false })),
              ),
            ),
          ),
        ),

        loadSpread: rxMethod<string>(
          pipe(
            tap(() => patchState(store, { activeSpreadLoading: true })),
            switchMap((id) =>
              spreadService.getById(id).pipe(
                tap((spread) =>
                  patchState(store, {
                    activeSpread: spread,
                    activeSnap: null,
                    activePageIdx: 0,
                    createSpreadError: false,
                  }),
                ),
                catchError((err: HttpErrorResponse) => {
                  patchState(store, { loadSpreadError: true });
                  return EMPTY;
                }),
                finalize(() => patchState(store, { activeSpreadLoading: false })),
              ),
            ),
          ),
        ),

        createSpread: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { activeSpreadLoading: true })),
            exhaustMap(() =>
              spreadService.create().pipe(
                tap((created) =>
                  patchState(store, {
                    activeSpread: created,
                    activeSnap: null,
                    activePageIdx: 0,
                    spreadsMetaData: [...store.spreadsMetaData(), toSpreadMetaData(created)],
                    createSpreadError: false,
                  }),
                ),
                catchError((err: HttpErrorResponse) => {
                  patchState(store, { createSpreadError: true });
                  return EMPTY;
                }),
                finalize(() => patchState(store, { activeSpreadLoading: false })),
              ),
            ),
          ),
        ),

        saveSpread: rxMethod<Spread>(
          pipe(
            tap(() => {
              uiStore.startSpreadSaving();
              uiStore.clearSpreadSavingError();
            }),
            concatMap((spread) => performSave(spread)),
          ),
        ),

        deleteSpread: rxMethod<string>(
          pipe(
            tap(() => uiStore.clearDeleteSpreadError()),
            exhaustMap((id) => {
              uiStore.startDeletingSpread(id);
              return spreadService.delete(id).pipe(
                tap(() => {
                  const isActive = store.activeSpread()?.id === id;
                  patchState(store, {
                    spreadsMetaData: store.spreadsMetaData().filter((spread) => spread.id !== id),
                    ...(isActive ? { activeSpread: null, activePageIdx: 0 } : {}),
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  uiStore.setDeleteSpreadError(err.message, String(err.status));
                  return EMPTY;
                }),
                finalize(() => uiStore.stopDeletingSpread()),
              );
            }),
          ),
        ),

        loadSnap: rxMethod<string>(
          pipe(
            switchMap((id) =>
              snapService.getById(id).pipe(
                tap((snap) =>
                  patchState(store, {
                    activeSnap: snap,
                    activeSpread: null,
                    activePageIdx: 0,
                    loadSnapError: false,
                  }),
                ),
                catchError((err: HttpErrorResponse) => {
                  patchState(store, { loadSnapError: true });
                  return EMPTY;
                }),
              ),
            ),
          ),
        ),

        createSnap: rxMethod<string>(
          pipe(
            tap(() => {
              patchState(store, { activeSnapLoading: true });
              uiStore.clearSpreadSavingError();
            }),
            exhaustMap((spreadId) => {
              const spread = store.activeSpread();
              if (!spread || spread.id !== spreadId) {
                patchState(store, { createSnapError: true, activeSnapLoading: false });
                return EMPTY;
              }
              uiStore.startSpreadSaving();
              return performSave(spread).pipe(
                switchMap((saved) => {
                  if (!meetsPublishingRequirements(saved.schema)) {
                    patchState(store, { createSnapError: true, activeSnapLoading: false });
                    return EMPTY;
                  }
                  return snapService.create(saved.id).pipe(
                    tap((created) => {
                      patchState(store, {
                        activeSnap: created,
                        activeSpread: null,
                        snapsMetaData: [...store.snapsMetaData(), toSnapMetaData(created)],
                        createSnapError: false,
                      });
                    }),
                    catchError((err: HttpErrorResponse) => {
                      patchState(store, { createSnapError: true });
                      return EMPTY;
                    }),
                  );
                }),
                finalize(() => patchState(store, { activeSnapLoading: false })),
              );
            }),
          ),
        ),

        deleteSnap: rxMethod<string>(
          pipe(
            tap((id) => uiStore.clearDeleteSnapError()),
            exhaustMap((id) => {
              uiStore.startDeletingSnap(id);
              return snapService.delete(id).pipe(
                tap(() => {
                  const isActive = store.activeSnap()?.id === id;
                  patchState(store, {
                    snapsMetaData: store.snapsMetaData().filter((snap) => snap.id !== id),
                    ...(isActive ? { activeSnap: null } : {}),
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  uiStore.setDeleteSnapError(err.message, String(err.status));
                  return EMPTY;
                }),
                finalize(() => uiStore.stopDeletingSnap()),
              );
            }),
          ),
        ),

        updateSpreadTitle(title: string): void {
          if (!store.activeSpread()) return;
          patchState(
            store,
            produce<DomainState>((draft) => {
              draft.activeSpread!.schema.title = title;
            }),
          );
          triggerAutoSave(store.activeSpread()!);
        },

        setActivePage(idx: number): void {
          patchState(store, { activePageIdx: idx });
        },

        updateQuestionLabel(elementId: string, label: string): void {
          if (!store.activeSpread()) return;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              const element = page.elements.find((e) => e.id === elementId);
              if (element?.type === 'question') element.el.label = label;
            }),
          );
          triggerAutoSave(store.activeSpread()!);
        },

        updateNoteValue(elementId: string, value: string): void {
          if (!store.activeSpread()) return;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              const element = page.elements.find((e) => e.id === elementId);
              if (element?.type === 'note') element.el.label = value;
            }),
          );
          triggerAutoSave(store.activeSpread()!);
        },

        addPage(): void {
          if (!store.activeSpread()) return;
          patchState(
            store,
            produce<DomainState>((draft) => {
              draft.activeSpread!.schema.pages.push(newPage());
            }),
          );
          triggerAutoSave(store.activeSpread()!);
        },

        deletePage(pageId: string): void {
          if (!store.activeSpread()) return;
          let changed = false;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const before = draft.activeSpread!.schema.pages.length;
              draft.activeSpread!.schema.pages = draft.activeSpread!.schema.pages.filter(
                (p) => p.id !== pageId,
              );
              changed = draft.activeSpread!.schema.pages.length !== before;
            }),
          );
          if (changed) triggerAutoSave(store.activeSpread()!);
        },

        addElement(params: CreateElementParams): void {
          if (!store.activeSpread()) return;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const element = newElement(params);
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              page.elements.push(element);
            }),
          );
          triggerAutoSave(store.activeSpread()!);
        },

        deleteElement(elementId: string): void {
          if (!store.activeSpread()) return;
          let changed = false;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              const before = page.elements.length;
              page.elements = page.elements.filter((e) => e.id !== elementId);
              changed = page.elements.length !== before;
            }),
          );
          if (changed) triggerAutoSave(store.activeSpread()!);
        },

        addOption(elementId: string, label: string, value: string | number | boolean): void {
          const trimmedLabel = label.trim();
          if (!trimmedLabel || !store.activeSpread()) return;

          let added = false;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              const element = page.elements.find((e) => e.id === elementId);
              if (element?.type === 'question' && 'options' in element.el) {
                const { optionValueType, options } = element.el;

                const coercedValue =
                  optionValueType === 'number'
                    ? Number(value)
                    : optionValueType === 'boolean'
                      ? Boolean(value)
                      : String(value).trim();

                if (
                  options.some((o) => o.value === coercedValue) ||
                  options.some((o) => o.label === trimmedLabel)
                )
                  return;

                options.push(newOption(trimmedLabel, coercedValue));
                added = true;
              }
            }),
          );
          if (added) triggerAutoSave(store.activeSpread()!);
        },

        deleteOption(elementId: string, optionId: string) {
          if (!store.activeSpread()) return;
          let deleted = false;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              const element = page.elements.find((e) => e.id === elementId);
              if (element?.type === 'question' && 'options' in element.el) {
                const before = element.el.options.length;
                element.el.options = element.el.options.filter((o) => o.id !== optionId);
                deleted = element.el.options.length !== before;
              }
            }),
          );
          if (deleted) triggerAutoSave(store.activeSpread()!);
        },

        editOption(
          elementId: string,
          optionId: string,
          label: string,
          value: string | number | boolean,
        ) {
          const trimmedLabel = label.trim();
          if (!trimmedLabel || !store.activeSpread()) return;

          let changed = false;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              const element = page.elements.find((e) => e.id === elementId);
              if (element?.type === 'question' && 'options' in element.el) {
                const { optionValueType, options } = element.el;

                const coercedValue =
                  optionValueType === 'number'
                    ? Number(value)
                    : optionValueType === 'boolean'
                      ? Boolean(value)
                      : String(value).trim();

                const existing = options.find((o) => o.id === optionId);
                if (!existing) return;

                if (existing.label === trimmedLabel && existing.value === coercedValue) return;

                if (
                  options.some((o) => o.id !== optionId && o.value === coercedValue) ||
                  options.some((o) => o.id !== optionId && o.label === trimmedLabel)
                )
                  return;

                element.el.options = options.map((o) =>
                  o.id === optionId ? { ...o, label: trimmedLabel, value: coercedValue } : o,
                );
                changed = true;
              }
            }),
          );
          if (changed) triggerAutoSave(store.activeSpread()!);
        },

        setValidatorRequired(elementId: string, value: boolean) {
          if (!store.activeSpread()) return;
          let changed = false;
          patchState(
            store,
            produce<DomainState>((draft) => {
              const page = draft.activeSpread!.schema.pages[draft.activePageIdx];
              const element = page.elements.find((e) => e.id === elementId);
              if (element?.type === 'question' && element.el.validators.required !== value) {
                element.el.validators.required = value;
                changed = true;
              }
            }),
          );
          if (changed) triggerAutoSave(store.activeSpread()!);
        },
      };
    },
  ),
);
