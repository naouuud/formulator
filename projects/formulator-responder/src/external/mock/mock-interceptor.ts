import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { ENV } from '../../app/env';
import { delay, of } from 'rxjs';
import { mockSchema } from './mock-schema';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace(ENV.API_URL, '');

  // GET /spills/:spillId/schema
  if (url.startsWith('/spills/') && url.endsWith('/schema')) {
    return of(new HttpResponse({ status: 200, body: mockSchema })).pipe(delay(2_000));
  }

  return next(req);
};
