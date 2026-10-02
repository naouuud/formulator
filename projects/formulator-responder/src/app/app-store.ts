import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RSchema, Schema } from '@formulator/schema';
import { catchError, EMPTY, finalize, Subject, switchMap, tap } from 'rxjs';
import { SpillService } from '../external/api/spill.service';
import { isUuid } from '../utils/is-uuid';

export type SpillWithSchema = {
  readonly id: string;
  readonly snapId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly rSchema: RSchema;
  readonly createdAt: Date;
  readonly lastModifiedAt: Date | null;
  readonly completedAt: Date | null;
  readonly sentAt: Date;
  readonly expiredAt: Date | null;
  readonly schema: Schema;
};

const spillLoadErrorStatusCodes = [400, 404, 409, 410, 500] as const;
export type SpillLoadErrorStatus = (typeof spillLoadErrorStatusCodes)[number];
/** HTTP status for a failed spill load, or `null` when there is no error. */
export type SpillLoadError = SpillLoadErrorStatus | null;

const isSpillLoadErrorStatusCode = (code: number): code is SpillLoadErrorStatus =>
  (spillLoadErrorStatusCodes as readonly number[]).includes(code);

const statusToSpillLoadError = (code: number): SpillLoadErrorStatus =>
  isSpillLoadErrorStatusCode(code) ? code : 500;

@Injectable()
export class AppStore {
  private readonly spillService = inject(SpillService);

  readonly #spillWithSchema = signal<SpillWithSchema | null>(null);
  readonly #spillLoading = signal(false);
  readonly #spillLoadError = signal<SpillLoadError>(null);
  readonly #activePageIdx = signal(0);
  readonly #submittingRSchema = signal(false);
  readonly #submissonError = signal('');

  readonly #loadSpillWithSchema$ = new Subject<string>();

  readonly spillWithSchema = this.#spillWithSchema.asReadonly();
  readonly spillLoading = this.#spillLoading.asReadonly();
  readonly spillLoadError = this.#spillLoadError.asReadonly();
  readonly activePageIdx = this.#activePageIdx.asReadonly();
  readonly submittingRSchema = this.#submittingRSchema.asReadonly();
  readonly submissionError = this.#submissonError.asReadonly();

  readonly spillId = computed(() => this.spillWithSchema()?.id);
  readonly schema = computed(() => this.spillWithSchema()?.schema);
  readonly rSchemaTemplate = computed(() => this.spillWithSchema()?.rSchema);

  constructor() {
    this.#loadSpillWithSchema$
      .pipe(
        takeUntilDestroyed(),
        switchMap((spillId) => {
          if (!isUuid(spillId)) {
            this.#spillWithSchema.set(null);
            this.#spillLoadError.set(400);
            return EMPTY;
          }
          this.#spillWithSchema.set(null);
          this.#spillLoadError.set(null);
          this.#spillLoading.set(true);
          return this.spillService.getSpillWithSchema(spillId).pipe(
            tap((spillWithSchema) => {
              this.#spillWithSchema.set(spillWithSchema);
              this.setPageIdx(0);
            }),
            catchError((err: HttpErrorResponse) => {
              this.#spillLoadError.set(statusToSpillLoadError(err.status));
              return EMPTY;
            }),
            finalize(() => this.#spillLoading.set(false)),
          );
        }),
      )
      .subscribe();
  }

  loadSpillWithSchema(spillId: string): void {
    this.#loadSpillWithSchema$.next(spillId);
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

  setSubmitting(): void {
    this.#submittingRSchema.set(true);
  }

  clearSubmitting(): void {
    this.#submittingRSchema.set(false);
  }

  setSubmissionError(errorMessage: string): void {
    this.#submissonError.set(errorMessage);
  }

  clearSubmissionError(): void {
    this.#submissonError.set('');
  }

  setSubmissionComplete(): void {}
}
