import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { newSchema } from '@formulator/schema';
import { delay, of } from 'rxjs';
import { Snap } from 'src/domain/model/snap';
import { snapToMetaData } from 'src/domain/model/snap-metadata';
import { Spread } from 'src/domain/model/spread';
import { SpreadMetaData, spreadToMetaData } from 'src/domain/model/spread-metadata';
import { ENV } from '../../app/env';
import { snapNotFound, spreadNotFound, versionConflict } from '../api/problem-detail';
import { mockSchema } from './mock-schema';

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
  { ...newMockSpread(), schema: mockSchema },
  newMockSpread('Cyberpunk Survey'),
  newMockSpread('CrossCode Survey'),
  newMockSpread('Sayonara Wildhearts Survey'),
  newMockSpread('Paradise Killer Survey'),
];

let mockSnaps: Snap[] = [];

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
      return of(new HttpResponse({ status: 200, body: updated })).pipe(delay(1500));
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

  // GET /snaps?spreadId=
  if (req.method === 'GET' && (url === '/snaps' || url.startsWith('/snaps?'))) {
    if (url === '/snaps') {
      return of(new HttpResponse({ status: 200, body: mockSnaps.map(snapToMetaData) }));
    }
    const spreadId = new URLSearchParams(url.slice('snaps?'.length)).get('spreadId');
    const snaps = spreadId ? mockSnaps.filter((snap) => snap.spreadId === spreadId) : mockSnaps;
    return of(
      new HttpResponse({
        status: 200,
        body: snaps.map(snapToMetaData),
      }),
    );
  }

  // GET /snaps/:id
  if (req.method === 'GET' && url.startsWith('/snaps/')) {
    const id = url.slice('/snaps/'.length);
    const snap = mockSnaps.find((snap) => snap.id === id);
    if (!snap) {
      return of(new HttpResponse({ status: 404, body: snapNotFound(id) }));
    }
    return of(new HttpResponse({ status: 200, body: snap }));
  }

  // POST /snaps
  if (req.method === 'POST' && url === '/snaps') {
    const { spreadId } = req.body as { spreadId: string };
    const spread = mockSpreads.find((s) => s.id === spreadId);
    if (!spread) return of(new HttpResponse({ status: 404, body: spreadNotFound(spreadId) }));
    const snaps = mockSnaps.filter((s) => s.spreadId === spreadId);
    const latest = snaps.length ? Math.max(...snaps.map((s) => s.edition)) : 0;
    const created: Snap = {
      id: crypto.randomUUID(),
      spreadId,
      spreadVersion: spread.version,
      edition: latest + 1,
      schema: structuredClone(spread.schema),
      status: 'active',
      publishedAt: new Date(),
      closedAt: null,
    };
    mockSnaps.push(created);
    return of(new HttpResponse({ status: 201, body: created }));
  }

  // DELETE /snaps/:id
  if (req.method === 'DELETE' && url.startsWith('/snaps/')) {
    const id = url.slice('/snaps/'.length);
    const exists = mockSnaps.find((snap) => snap.id === id);
    if (exists) {
      mockSnaps = mockSnaps.filter((snap) => snap.id !== id);
      return of(new HttpResponse({ status: 204, body: null }));
    }
    return of(new HttpResponse({ status: 404, body: snapNotFound(id) }));
  }

  return next(req);
};
