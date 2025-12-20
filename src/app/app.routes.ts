import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./builder/builder-parent/builder-parent').then((m) => m.BuilderParent),
  },
  {
    path: 'view',
    loadComponent: () =>
      import('./renderer/renderer-parent/renderer-parent').then((m) => m.RendererParent),
  },
];
