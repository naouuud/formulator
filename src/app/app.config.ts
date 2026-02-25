import {
  ApplicationConfig,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IFormRepo } from './services/form-repo';
import { ENV } from './env';
import { FormRepoLocal } from './services/form-repo-local';
import { FormRepoApi } from './services/form-repo-api';

export const FORM_REPO = new InjectionToken<IFormRepo>('FORM_REPO');
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    { provide: FORM_REPO, useClass: ENV.APP_MODE === 'local' ? FormRepoLocal : FormRepoApi },
  ],
};
