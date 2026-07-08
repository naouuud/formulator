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
  finalize,
  Observable,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { SpreadService } from '../../external/api/spread.service';
import { UiStore } from '../../ui/store/ui-store';
import { CreateElementParams, newElement } from '../model/element';
import { newOption } from '../model/option';
import { newPage } from '../model/page';
import { Spread, SpreadMetaData, toMetaData, updateMetaData } from '../model/spread';
import { User } from '../model/user';

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
    const performSave = (spread: Spread): Observable<Spread> => {
      return spreadService.update(spread).pipe(
        tap((updated) => {
          patchState(store, { spreadsMetaData: updateMetaData(store.spreadsMetaData(), updated) });
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
                  spreadsMetaData: store.spreadsMetaData().filter((m) => m.id !== id),
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
      updateSpreadTitle(title: string): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            draft.activeSpread!.title = title;
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
            const element = page.elements.find((e) => e.id === elementId);
            if (element?.type === 'note') element.el.value = value;
          }),
        );
        triggerAutoSave(store.activeSpread()!);
      },
      addPage(): void {
        if (!store.activeSpread()) return;
        patchState(
          store,
          produce<DomainState>((draft) => {
            draft.activeSpread!.pages.push(newPage());
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
            const before = draft.activeSpread!.pages.length;
            draft.activeSpread!.pages = draft.activeSpread!.pages.filter((p) => p.id !== pageId);
            changed = draft.activeSpread!.pages.length !== before;
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
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
            const page = draft.activeSpread!.pages[draft.activePageIdx];
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
  }),
);
