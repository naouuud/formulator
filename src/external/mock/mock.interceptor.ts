import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { newPage, newSchema } from '@formulator/schema';
import { of } from 'rxjs';
import { Spread } from 'src/domain/model/spread';
import { SpreadMetaData, spreadToMetaData } from 'src/domain/model/spread-metadata';
import { ENV } from '../../app/env';
import { spreadNotFound, versionConflict } from '../api/problem-detail';

const newMockSpread = (title?: string): Spread => {
  const schema = newSchema();
  if (title) schema.title = title;
  return {
    id: crypto.randomUUID(),
    version: 0,
    ectm: null,
    schema,
    createdAt: new Date(),
    lastModifiedAt: new Date(),
  };
};

let mockSpreads: Spread[] = [
  newMockSpread('Cyberpunk Survey'),
  newMockSpread('CrossCode Survey'),
  newMockSpread('Sayonara Wildhearts Survey'),
  newMockSpread('Paradise Killer Survey'),
];

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace(ENV.API_URL, '');

  // GET /spreads
  if (req.method === 'GET' && url === '/spreads') {
    const metaData: SpreadMetaData[] = mockSpreads.map(spreadToMetaData);
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
