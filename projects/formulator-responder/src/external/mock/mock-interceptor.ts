import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { ENV } from '../../app/env';
import { delay, of } from 'rxjs';
import { newRSchema } from '@formulator/schema';
import { mockSchema } from './mock-schema';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace(ENV.API_URL, '');
  const [path, queryString = ''] = url.split('?');

  // GET /spills/:spillId?schema=true
  if (req.method === 'GET' && path.startsWith('/spills/')) {
    const spillId = path.slice('/spills/'.length);
    if (!spillId || spillId.includes('/')) {
      return next(req);
    }
    const schema = new URLSearchParams(queryString).get('schema');
    if (schema !== 'true') {
      return next(req);
    }
    return of(
      new HttpResponse({
        status: 200,
        body: {
          id: spillId,
          snapId: '00000000-0000-0000-0000-000000000001',
          firstName: '',
          lastName: '',
          email: 'responder@example.com',
          rSchema: newRSchema(mockSchema),
          createdAt: new Date().toISOString(),
          lastModifiedAt: null,
          completedAt: null,
          sentAt: new Date().toISOString(),
          expiredAt: null,
          schema: mockSchema,
        },
      }),
    ).pipe(delay(2_000));
  }

  return next(req);
};
