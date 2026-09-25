import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Schema } from '@formulator/schema';
import { catchError, EMPTY, finalize, Subject, switchMap, tap } from 'rxjs';
import { SpillService } from '../external/api/spill.service';
import { isUuid } from '../utils/is-uuid';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly spillService = inject(SpillService);

  readonly #schema = signal<Schema | null>(null);
  readonly #schemaLoading = signal(false);
  readonly #schemaLoadError = signal(false);
  readonly #activePageIdx = signal(0);

  readonly #loadSchema$ = new Subject<string>();

  readonly schema = this.#schema.asReadonly();
  readonly schemaLoading = this.#schemaLoading.asReadonly();
  readonly schemaLoadError = this.#schemaLoadError.asReadonly();
  readonly activePageIdx = this.#activePageIdx.asReadonly();

  constructor() {
    this.#loadSchema$
      .pipe(
        takeUntilDestroyed(),
        switchMap((spillId) => {
          if (!isUuid(spillId)) {
            return EMPTY;
          }
          this.#schema.set(null);
          this.#schemaLoadError.set(false);
          this.#schemaLoading.set(true);
          return this.spillService.getSchema(spillId).pipe(
            tap((schema) => {
              this.#schema.set(schema);
              this.setPageIdx(0);
            }),
            catchError((err: HttpErrorResponse) => {
              console.log(err);
              this.#schemaLoadError.set(true);
              return EMPTY;
            }),
            finalize(() => this.#schemaLoading.set(false)),
          );
        }),
      )
      .subscribe();
  }

  loadSchema(spillId: string): void {
    this.#loadSchema$.next(spillId);
  }

  setPageIdx(idx: number): void {
    const schema = this.schema();
    if (!schema || idx < 0 || idx >= schema.pages.length) return;
    this.#activePageIdx.set(idx);
  }

  incrementPageIdx(): void {
    const schema = this.schema();
    if (!schema || this.#activePageIdx() >= schema.pages.length - 1) return;
    this.#activePageIdx.update((i) => i + 1);
  }

  decrementPageIdx(): void {
    if (!this.schema() || this.#activePageIdx() <= 0) return;
    this.#activePageIdx.update((i) => i - 1);
  }
}
