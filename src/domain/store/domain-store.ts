import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { produce } from 'immer';
import {
  catchError,
  concatMap,
  debounceTime,
  EMPTY,
  exhaustMap,
  Observable,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { SpreadService } from '../../external/api/spread.service';
import { CreateElementParams, newElement } from '../model/element';
import { newOption } from '../model/option';
import { newPage } from '../model/page';
import { Spread, SpreadMetaData, toMetaData, updateMetaData } from '../model/spread';
import { User } from '../model/user';
import { UiStore } from '../../ui/store/ui-store';

type DomainState = {
  user: User | null;
  spreadsMetaData: SpreadMetaData[];
  spreadsMetaDataLoading: boolean;
  activeSpread: Spread | null;
  activeSpreadLoading: boolean;
  activePageIdx: number;
  loadMetaDataError: boolean;
  loadSpreadError: boolean;
  createSpreadError: boolean;
};

const initialState: DomainState = {
  user: null,
  spreadsMetaData: [],
  spreadsMetaDataLoading: false,
  activeSpread: null,
  activeSpreadLoading: false,
  activePageIdx: 0,
  loadMetaDataError: false,
  loadSpreadError: false,
  createSpreadError: false,
};

export const DomainStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    activePage: computed(() => state.activeSpread()?.pages[state.activePageIdx()]),
  })),
  withMethods((store, spreadService = inject(SpreadService), uiStore = inject(UiStore)) => {
    const performSave = (): Observable<Spread> => {
      const spread = store.activeSpread();
      if (!spread) return EMPTY;
      return spreadService.update(spread).pipe(
        tap((updated) => {
          const current = store.activeSpread();
          if (!current) return;
          const merged: Spread = {
            ...current,
            version: updated.version,
            lastModifiedAt: updated.lastModifiedAt,
          };
          patchState(store, {
            activeSpread: merged,
            spreadsMetaData: updateMetaData(store.spreadsMetaData(), merged),
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

    const triggerAutoSave = rxMethod<void>(
      pipe(
        debounceTime(1500),
        tap(() => {
          uiStore.startSpreadSaving();
          uiStore.clearSpreadSavingError();
        }),
        switchMap(() => performSave()),
      ),
    );

    return {
      loadMetaData: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { spreadsMetaDataLoading: true })),
          switchMap(() =>
            spreadService.getAll().pipe(
              tap((spreadsMetaData) => {
                patchState(store, {
                  spreadsMetaData: [...spreadsMetaData],
                  spreadsMetaDataLoading: false,
                });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { loadMetaDataError: true, spreadsMetaDataLoading: false });
                return EMPTY;
              }),
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
                  activeSpreadLoading: false,
                  activePageIdx: 0,
                }),
              ),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { loadSpreadError: true, activeSpreadLoading: false });
                return EMPTY;
              }),
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
                  activePageIdx: 0,
                  activeSpreadLoading: false,
                  createSpreadError: false,
                  spreadsMetaData: [...store.spreadsMetaData(), toMetaData(created)],
                }),
              ),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { createSpreadError: true, activeSpreadLoading: false });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
      saveSpread: rxMethod<void>(
        pipe(
          tap(() => {
            uiStore.startSpreadSaving();
            uiStore.clearSpreadSavingError();
          }),
          concatMap(() => performSave()),
        ),
      ),
      updateSpreadTitle(title: string): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            draft.activeSpread!.title = title;
          }),
        );
        triggerAutoSave();
      },
      setActivePage(idx: number): void {
        patchState(store, { activePageIdx: idx });
      },
      updateQuestionLabel(elementId: string, label: string): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            const page = draft.activeSpread!.pages[draft.activePageIdx];
            const element = page.elements.find((e) => e.id === elementId);
            if (element?.type === 'question') element.el.label = label;
          }),
        );
        triggerAutoSave();
      },
      updateNoteValue(elementId: string, value: string): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            const page = draft.activeSpread!.pages[draft.activePageIdx];
            const element = page.elements.find((e) => e.id === elementId);
            if (element?.type === 'note') element.el.value = value;
          }),
        );
        triggerAutoSave();
      },
      addPage(): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            draft.activeSpread!.pages.push(newPage());
          }),
        );
        triggerAutoSave();
      },
      addElement(params: CreateElementParams): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            const element = newElement(params);
            const page = draft.activeSpread!.pages[draft.activePageIdx];
            page.elements.push(element);
          }),
        );
        triggerAutoSave();
      },
      addOption(elementId: string, label: string, value: string | number): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            const page = draft.activeSpread!.pages[draft.activePageIdx];
            const element = page.elements.find((e) => e.id === elementId);
            if (element?.type === 'question' && 'optionList' in element.el) {
              element.el.optionList.options.push(newOption(label, value));
            }
          }),
        );
        triggerAutoSave();
      },
    };
  }),
);
