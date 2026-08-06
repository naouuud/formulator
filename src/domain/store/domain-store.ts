import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { CreateElementParams, newElement, newOption, newPage } from '@formulator/schema';
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
import { SpillService } from 'src/external/api/spill.service';
import { SpreadService } from '../../external/api/spread.service';
import { problemDetailMessage } from '../../external/api/problem-detail';
import { UiStore } from '../../ui/store/ui-store';
import { Snap, deriveSnapStatus } from '../model/snap';
import { SnapMetaData, toSnapMetaData } from '../model/snap-metadata';
import { SpillMetaData } from '../model/spill-metadata';
import { meetsPublishingRequirements, Spread } from '../model/spread';
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
  spills: SpillMetaData[];
  loadSpillsError: boolean;
  createSpillsLoading: boolean;
  createSpillsError: string | null;
  createSpillsSuccessCount: number | null;
  deletingSpillId: string | null;
  deleteSpillError: boolean;

  createSpreadError: { message: string; code?: number } | null;
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
  spills: [],
  loadSpillsError: false,
  createSpillsLoading: false,
  createSpillsError: null,
  createSpillsSuccessCount: null,
  deletingSpillId: null,
  deleteSpillError: false,

  createSpreadError: null,
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
    snapGroups: computed(() =>
      state.spreadsMetaData().map((spread) => ({
        spread: spread,
        snaps: state
          .snapsMetaData()
          .filter((snap) => snap.spreadId === spread.id)
          .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
      })),
    ),
    orphanSnaps: computed(() => {
      return state
        .snapsMetaData()
        .filter((snap) => !snap.spreadId)
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    }),
  })),

  withMethods(
    (
      store,
      spreadService = inject(SpreadService),
      snapService = inject(SnapService),
      spillService = inject(SpillService),
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
          }),
          catchError((err: HttpErrorResponse) => {
            uiStore.setSpreadSavingError(problemDetailMessage(err), err.status);
            return EMPTY;
          }),
          finalize(() => uiStore.stopSpreadSaving()),
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

        loadSpillsMetaData: rxMethod<string | null>(
          pipe(
            tap(() =>
              patchState(store, { spills: [], loadSpillsError: false, deleteSpillError: false }),
            ),
            switchMap((snapId) => {
              if (!snapId) return EMPTY;
              return spillService.getAll(snapId).pipe(
                tap((loaded) => {
                  const status = deriveSnapStatus(loaded);
                  const activeSnap = store.activeSnap();
                  const snapStillActive = activeSnap?.id === snapId;
                  patchState(store, {
                    ...(snapStillActive
                      ? { spills: loaded, activeSnap: { ...activeSnap, status } }
                      : {}),
                    snapsMetaData: store
                      .snapsMetaData()
                      .map((snap) => (snap.id === snapId ? { ...snap, status } : snap)),
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  if (store.activeSnap()?.id === snapId)
                    patchState(store, { loadSpillsError: true });
                  return EMPTY;
                }),
              );
            }),
          ),
        ),

        createSpills: rxMethod<{
          snapId: string;
          responders: { email: string; firstName?: string; lastName?: string }[];
        }>(
          pipe(
            exhaustMap(({ snapId, responders }) => {
              if (!responders.length) return EMPTY;
              patchState(store, {
                createSpillsLoading: true,
                createSpillsError: null,
                createSpillsSuccessCount: null,
              });
              return forkJoin(
                responders.map((responder) =>
                  spillService.create({
                    snapId,
                    email: responder.email,
                    firstName: responder.firstName,
                    lastName: responder.lastName,
                  }),
                ),
              ).pipe(
                tap((created) => {
                  const activeSnap = store.activeSnap();
                  if (activeSnap?.id !== snapId) return;
                  const spills = [...store.spills(), ...created].sort(
                    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                  );
                  const status = deriveSnapStatus(spills);
                  patchState(store, {
                    spills,
                    activeSnap: { ...activeSnap, status },
                    snapsMetaData: store
                      .snapsMetaData()
                      .map((snap) => (snap.id === snapId ? { ...snap, status } : snap)),
                    createSpillsError: null,
                    createSpillsSuccessCount: created.length,
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  patchState(store, { createSpillsError: problemDetailMessage(err) });
                  return EMPTY;
                }),
                finalize(() => patchState(store, { createSpillsLoading: false })),
              );
            }),
          ),
        ),

        deleteSpill: rxMethod<string>(
          pipe(
            exhaustMap((id) => {
              const snapId = store.spills().find((spill) => spill.id === id)?.snapId;
              patchState(store, { deletingSpillId: id, deleteSpillError: false });
              return spillService.delete(id).pipe(
                tap(() => {
                  const activeSnap = store.activeSnap();
                  const snapStillActive = activeSnap && activeSnap.id === snapId;
                  const remaining = store.spills().filter((spill) => spill.id !== id);
                  const canDeriveStatus =
                    snapId != null && remaining.every((spill) => spill.snapId === snapId);
                  const status = canDeriveStatus ? deriveSnapStatus(remaining) : null;

                  patchState(store, {
                    ...(snapStillActive && status !== null
                      ? { spills: remaining, activeSnap: { ...activeSnap, status } }
                      : {}),
                    ...(snapId && status !== null
                      ? {
                          snapsMetaData: store
                            .snapsMetaData()
                            .map((snap) => (snap.id === snapId ? { ...snap, status } : snap)),
                        }
                      : {}),
                    deleteSpillError: false,
                  });
                }),
                catchError((_err: HttpErrorResponse) => {
                  patchState(store, { deleteSpillError: true });
                  return EMPTY;
                }),
                finalize(() => patchState(store, { deletingSpillId: null })),
              );
            }),
          ),
        ),

        clearDeleteSpillError(): void {
          patchState(store, { deleteSpillError: false });
        },

        loadSpread: rxMethod<string>(
          pipe(
            tap(() => patchState(store, { activeSpreadLoading: true })),
            switchMap((id) =>
              spreadService.getById(id).pipe(
                tap((spread) =>
                  patchState(store, {
                    activeSpread: spread,
                    activePageIdx: 0,
                    createSpreadError: null,
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

        createSpread: rxMethod<string>(
          pipe(
            tap(() => patchState(store, { activeSpreadLoading: true })),
            exhaustMap((spreadTitle) =>
              spreadService.create(spreadTitle).pipe(
                tap((created) =>
                  patchState(store, {
                    activeSpread: created,
                    activePageIdx: 0,
                    spreadsMetaData: [toSpreadMetaData(created), ...store.spreadsMetaData()],
                    createSpreadError: null,
                  }),
                ),
                catchError((err: HttpErrorResponse) => {
                  patchState(store, {
                    createSpreadError: { message: err.message, code: err.status },
                  });
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
                  uiStore.setDeleteSpreadError(err.message, err.status);
                  return EMPTY;
                }),
                finalize(() => uiStore.stopDeletingSpread()),
                switchMap(() => {
                  patchState(store, { metaDataLoading: true });
                  return snapService.getAll().pipe(
                    tap((updated) => patchState(store, { snapsMetaData: updated })),
                    catchError((err: HttpErrorResponse) => {
                      const updated = store
                        .snapsMetaData()
                        .map((snap) =>
                          snap.spreadId === id
                            ? { ...snap, spreadId: null, spreadVersion: null, edition: null }
                            : snap,
                        );
                      patchState(store, { snapsMetaData: updated });
                      return EMPTY;
                    }),
                    finalize(() => patchState(store, { metaDataLoading: false })),
                  );
                }),
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

        createSnap: rxMethod<{ spreadId: string; snapTitle: string }>(
          pipe(
            tap(() => {
              patchState(store, { activeSnapLoading: true });
              uiStore.clearSpreadSavingError();
            }),
            exhaustMap(({ spreadId, snapTitle }) => {
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
                  return snapService.create(saved.id, snapTitle).pipe(
                    tap((created) => {
                      patchState(store, {
                        activeSnap: created,
                        snapsMetaData: [...store.snapsMetaData(), toSnapMetaData(created)],
                        createSnapError: false,
                      });
                      uiStore.setWorkspace('share');
                      uiStore.setSnapViewerTab('currentShares');
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
                  uiStore.setDeleteSnapError(err.message, err.status);
                  return EMPTY;
                }),
                finalize(() => uiStore.stopDeletingSnap()),
              );
            }),
          ),
        ),

        renameSpreadTitle: rxMethod<string>(
          pipe(
            exhaustMap((title) => {
              const spread = store.activeSpread();
              if (!spread) return EMPTY;

              const trimmed = title.trim();
              if (!trimmed) return EMPTY;

              uiStore.startSpreadSaving();
              uiStore.clearSpreadSavingError();

              return spreadService.update({ ...spread, spreadTitle: trimmed }).pipe(
                tap((updated) => {
                  patchState(store, {
                    spreadsMetaData: updateMetaData(store.spreadsMetaData(), updated),
                  });
                  const current = store.activeSpread();
                  if (current?.id === updated.id) {
                    patchState(store, {
                      activeSpread: {
                        ...current,
                        spreadTitle: updated.spreadTitle,
                        version: updated.version,
                        lastModifiedAt: updated.lastModifiedAt,
                      },
                    });
                  }
                }),
                catchError((err: HttpErrorResponse) => {
                  uiStore.setSpreadSavingError(problemDetailMessage(err), err.status);
                  return EMPTY;
                }),
                finalize(() => uiStore.stopSpreadSaving()),
              );
            }),
          ),
        ),

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
