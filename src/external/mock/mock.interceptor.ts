import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ENV } from '../../app/env';
import { Spread, SpreadMetaData, toMetaData } from '../../domain/model/spread';
import { newPage } from '../../domain/model/page';

let mockSpreads: Spread[] = [
  {
    id: 'acc5810f-3efc-4cc6-9f0e-c22d08e1d7f8',
    title: 'Cyberpunk 2077 Survey',
    version: 0,
    ectm: null,
    pages: [newPage()],
    createdAt: new Date('2026-07-04T22:25:09.661Z'),
    lastModifiedAt: new Date('2026-07-04T22:25:09.661Z'),
  },
  {
    id: '7e576682-59d5-4448-abc8-1c45f450e42e',
    title: 'Paradise Killer Survey',
    version: 0,
    ectm: null,
    pages: [newPage()],
    createdAt: new Date('2026-07-04T22:25:09.830Z'),
    lastModifiedAt: new Date('2026-07-04T22:25:09.830Z'),
  },
  {
    id: 'dcb45081-da71-4691-a0dc-047c0f954a15',
    title: 'Sayonara Wildhearts Survey',
    version: 0,
    ectm: null,
    pages: [newPage()],
    createdAt: new Date('2026-07-04T22:25:10.027Z'),
    lastModifiedAt: new Date('2026-07-04T22:25:10.027Z'),
  },
  {
    id: 'e79bd9f2-fe8e-4cf1-9b22-a75dec95be6e',
    title: 'CrossCode Survey',
    version: 0,
    ectm: null,
    pages: [newPage()],
    createdAt: new Date('2026-07-04T22:25:10.231Z'),
    lastModifiedAt: new Date('2026-07-04T22:25:10.231Z'),
  },
];

const newMockSpread = (): Spread => ({
  id: crypto.randomUUID(),
  title: '',
  version: 0,
  ectm: null,
  pages: [],
  createdAt: new Date(),
  lastModifiedAt: new Date(),
});

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace(ENV.API_URL, '');

  // GET /spreads
  if (req.method === 'GET' && url === '/spreads') {
    const metaData: SpreadMetaData[] = mockSpreads.map(toMetaData);
    return of(new HttpResponse({ status: 200, body: metaData }));
  }

  // GET /spreads/:id
  if (req.method === 'GET' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    const spread = mockSpreads.find((s) => s.id === id);
    const status = spread ? 200 : 404;
    return of(new HttpResponse({ status, body: spread ?? null }));
  }

  // POST /spreads
  if (req.method === 'POST' && url === '/spreads') {
    const created = newMockSpread();
    mockSpreads.push(created);
    return of(new HttpResponse({ status: 201, body: created }));
  }

  // PUT /spreads/:id
  if (req.method === 'PUT' && url.startsWith('/spreads/')) {
    const updated = req.body as Spread;
    const id = url.slice('/spreads/'.length);
    const exists = mockSpreads.some((spread) => spread.id === id);
    if (exists) {
      mockSpreads = mockSpreads.map((spread) => (spread.id === id ? updated : spread));
      return of(new HttpResponse({ status: 200, body: updated })).pipe(delay(1500));
    }
    return of(new HttpResponse({ status: 404, body: null }));
  }

  // DELETE /spreads/:id
  if (req.method === 'DELETE' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    const exists = mockSpreads.some((spread) => spread.id === id);
    if (exists) {
      mockSpreads = mockSpreads.filter((spread) => spread.id !== id);
      return of(new HttpResponse({ status: 204, body: null })).pipe(delay(1500));
    }
    return of(new HttpResponse({ status: 404, body: null }));
  }

  return next(req);
};
