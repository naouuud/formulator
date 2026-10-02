import { Component, computed, inject } from '@angular/core';
import { AppStore, SpillLoadErrorStatus } from '../app-store';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormParent } from '../form/components/form-parent/form-parent';

type SpillLoadErrorView = {
  title: string;
  body: string;
  tone: 'danger' | 'warning' | 'neutral';
};

function spillLoadErrorView(code: SpillLoadErrorStatus): SpillLoadErrorView {
  switch (code) {
    case 400:
      return {
        title: 'Invalid request',
        body: 'This form link could not be loaded because the request was invalid. Please use the full link you were sent.',
        tone: 'warning',
      };
    case 404:
      return {
        title: 'Form not found',
        body: 'This form link is invalid or no longer exists. Please check the link and try again.',
        tone: 'warning',
      };
    case 409:
      return {
        title: 'Already submitted',
        body: 'This form has already been completed. No further responses can be submitted for this link.',
        tone: 'neutral',
      };
    case 410:
      return {
        title: 'Form expired',
        body: 'The deadline for this form has passed. This link is no longer accepting responses.',
        tone: 'warning',
      };
    case 500:
      return {
        title: 'Something went wrong',
        body: 'We could not load this form due to a server error. Please try again in a few minutes.',
        tone: 'danger',
      };
  }
}

@Component({
  selector: 'app-shell',
  imports: [FormParent],
  providers: [AppStore],
  templateUrl: './app-shell.html',
})
export class AppShell {
  protected readonly store = inject(AppStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly spillLoadErrorView = computed(() => {
    const status = this.store.spillLoadError();
    if (status === null) {
      return null;
    }
    return spillLoadErrorView(status);
  });

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('spillId')),
        filter((spillId): spillId is string => !!spillId),
        takeUntilDestroyed(),
      )
      .subscribe((spillId) => this.store.loadSpillWithSchema(spillId));
  }
}
