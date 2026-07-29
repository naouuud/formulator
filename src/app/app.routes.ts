import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app-shell/app-shell').then((m) => m.AppShell),
  },
];
