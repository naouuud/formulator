import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENV } from './env';
import { mockInterceptor } from '../external/mock/mock-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      ENV.APP_MODE === 'mock' ? withInterceptors([mockInterceptor]) : withInterceptors([]),
    ),
  ],
};
