import { Routes } from '@angular/router';
import { spillIdGuard } from '../guards/spill-id.guard';

export const routes: Routes = [
  {
    path: ':spillId/complete',
    canActivate: [spillIdGuard],
    loadComponent: () =>
      import('./submission-complete/submission-complete').then((m) => m.SubmissionComplete),
  },
  {
    path: ':spillId',
    canActivate: [spillIdGuard],
    loadComponent: () => import('./app-shell/app-shell').then((m) => m.AppShell),
  },
  {
    path: '',
    loadComponent: () => import('./invalid-link/invalid-link').then((m) => m.InvalidLink),
  },
  {
    path: '**',
    loadComponent: () => import('./invalid-link/invalid-link').then((m) => m.InvalidLink),
  },
];
