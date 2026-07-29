import { DatePipe, NgClass } from '@angular/common';
import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { SpillMetaData } from '../../../../domain/model/spill-metadata';
import { SpillService } from '../../../../external/api/spill.service';

@Component({
  selector: 'app-spill-list',
  imports: [DatePipe, NgClass],
  templateUrl: './spill-list.html',
})
export class SpillList {
  readonly snapId = input.required<string>();

  readonly #spillService = inject(SpillService);

  protected readonly spills = signal<SpillMetaData[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  constructor() {
    effect(() => {
      const snapId = this.snapId();
      untracked(() => this.loadSpills(snapId));
    });
  }

  protected reload(): void {
    this.loadSpills(this.snapId());
  }

  protected displayName(spill: SpillMetaData): string {
    const name = [spill.firstName, spill.lastName].filter(Boolean).join(' ').trim();
    return name || spill.email;
  }

  protected statusLabel(spill: SpillMetaData): string {
    if (spill.completedAt) return 'Complete';
    if (spill.expiredAt) return 'Expired';
    if (spill.sentAt) return 'Sent';
    return 'Draft';
  }

  protected statusClass(spill: SpillMetaData): string {
    if (spill.completedAt) return 'text-emerald-600';
    if (spill.expiredAt) return 'text-slate-400';
    if (spill.sentAt) return 'text-sky-600';
    return 'text-amber-600';
  }

  private loadSpills(snapId: string): void {
    this.loading.set(true);
    this.error.set(false);

    this.#spillService
      .getAll(snapId)
      .pipe(
        tap((spills) => this.spills.set(spills)),
        catchError(() => {
          this.error.set(true);
          this.spills.set([]);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
