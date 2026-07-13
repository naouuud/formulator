import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { ENV } from '../../app/env';
import { newPage, Spread, SpreadMetaData, toMetaData } from '@formulator/schema';
import { spreadNotFound, versionConflict } from '../api/problem-detail';

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
  pages: [newPage()],
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
    if (!spread) {
      return of(new HttpResponse({ status: 404, body: spreadNotFound(id) }));
    }
    return of(new HttpResponse({ status: 200, body: spread }));
  }

  // POST /spreads
  if (req.method === 'POST' && url === '/spreads') {
    const created = newMockSpread();
    mockSpreads.push(created);
    return of(new HttpResponse({ status: 201, body: created }));
  }

  // PUT /spreads/:id
  if (req.method === 'PUT' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    const existing = mockSpreads.find((spread) => spread.id === id);
    if (existing) {
      const updated = { ...(req.body as Spread) };
      if (updated.version !== existing.version) {
        return of(
          new HttpResponse({
            status: 409,
            body: versionConflict(updated.version, existing.version),
          }),
        );
      }
      updated.version = existing.version + 1;
      updated.lastModifiedAt = new Date();
      mockSpreads = mockSpreads.map((spread) => (spread.id === id ? updated : spread));
      return of(new HttpResponse({ status: 200, body: updated }));
    }
    return of(new HttpResponse({ status: 404, body: spreadNotFound(id) }));
  }

  // DELETE /spreads/:id
  if (req.method === 'DELETE' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    const exists = mockSpreads.some((spread) => spread.id === id);
    if (exists) {
      mockSpreads = mockSpreads.filter((spread) => spread.id !== id);
      return of(new HttpResponse({ status: 204, body: null }));
    }
    return of(new HttpResponse({ status: 404, body: spreadNotFound(id) }));
  }

  return next(req);
};
