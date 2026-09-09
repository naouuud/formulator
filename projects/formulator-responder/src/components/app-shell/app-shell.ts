import { Component, inject } from '@angular/core';
import { AppStore } from '../../store/app-store';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  imports: [],
  templateUrl: './app-shell.html',
})
export class AppShell {
  protected readonly store = inject(AppStore);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('spillId')),
        filter((spillId): spillId is string => !!spillId),
        takeUntilDestroyed(),
      )
      .subscribe((spillId) => this.store.loadSchema(spillId));
  }
}
