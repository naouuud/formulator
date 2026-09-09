import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Schema } from '@formulator/schema';
import { catchError, EMPTY, finalize, Subject, switchMap, tap } from 'rxjs';
import { isUuid } from '../utils/is-uuid';
import { SpillService } from '../external/spill.service';

type AppState = {
  schema: WritableSignal<Schema | null>;
  schemaLoading: WritableSignal<boolean>;
  schemaLoadError: WritableSignal<boolean>;
};

const initialState: AppState = {
  schema: signal(null),
  schemaLoading: signal(false),
  schemaLoadError: signal(false),
};

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly spillService = inject(SpillService);
  private readonly appState = initialState;
  private readonly loadSchema$ = new Subject<string>();

  readonly schema = this.appState.schema.asReadonly();
  readonly schemaLoading = this.appState.schemaLoading.asReadonly();
  readonly schemaLoadError = this.appState.schemaLoadError.asReadonly();

  constructor() {
    this.loadSchema$
      .pipe(
        takeUntilDestroyed(),
        switchMap((spillId) => {
          if (!isUuid(spillId)) {
            return EMPTY;
          }
          this.appState.schema.set(null);
          this.appState.schemaLoadError.set(false);
          this.appState.schemaLoading.set(true);
          return this.spillService.getSchema(spillId).pipe(
            tap((schema) => {
              this.appState.schema.set(schema);
            }),
            catchError((err: HttpErrorResponse) => {
              this.appState.schemaLoadError.set(true);
              return EMPTY;
            }),
            finalize(() => this.appState.schemaLoading.set(false)),
          );
        }),
      )
      .subscribe();
  }

  loadSchema(spillId: string): void {
    this.loadSchema$.next(spillId);
  }
}
