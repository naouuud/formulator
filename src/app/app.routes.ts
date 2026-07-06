import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./builder/components/builder-parent/builder-parent').then((m) => m.BuilderParent),
  },
];
