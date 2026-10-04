import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'workspace',
    loadComponent: () => import('./app-shell/app-shell').then((m) => m.AppShell),
  },
];
