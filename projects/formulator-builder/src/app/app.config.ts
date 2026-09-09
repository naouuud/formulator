import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { DomainStore } from '../domain/store/domain-store';
import { mockInterceptor } from '../external/mock/mock.interceptor';
import { routes } from './app.routes';
import { ENV } from './env';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const domainStore = inject(DomainStore);
      domainStore.loadMetaData();
    }),
    provideHttpClient(
      ENV.APP_MODE === 'mock' ? withInterceptors([mockInterceptor]) : withInterceptors([]),
    ),
  ],
};
