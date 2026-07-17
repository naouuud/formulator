import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { newSchema } from '@formulator/schema';
import { of } from 'rxjs';
import { Snap } from 'src/domain/model/snap';
import { snapToMetaData } from 'src/domain/model/snap-metadata';
import { Spread } from 'src/domain/model/spread';
import { spreadToMetaData } from 'src/domain/model/spread-metadata';
import { toSnapDto } from 'src/domain/model/wire/snap.mapper';
import { toSnapMetaDataDto } from 'src/domain/model/wire/snap-metadata.mapper';
import { toSpreadDto, toSpreadMetaDataDto } from 'src/domain/model/wire/spread.mapper';
import { ENV } from '../../app/env';
import {
  invalidRequestBody,
  snapNotFound,
  spreadIdMismatch,
  spreadNotFound,
  versionConflict,
} from '../api/problem-detail';
import { mockSchema } from './mock-schema';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_RE.test(value);

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
  { ...newMockSpread(), schema: structuredClone(mockSchema) },
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
    const metaData = mockSpreads.map((spread) => toSpreadMetaDataDto(spreadToMetaData(spread)));
    return of(new HttpResponse({ status: 200, body: metaData }));
  }

  // GET /spreads/:id
  if (req.method === 'GET' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    const spread = mockSpreads.find((s) => s.id === id);
    if (!spread) {
      return of(new HttpResponse({ status: 404, body: spreadNotFound(id) }));
    }
    return of(new HttpResponse({ status: 200, body: toSpreadDto(spread) }));
  }

  // POST /spreads
  if (req.method === 'POST' && url === '/spreads') {
    const created = newMockSpread();
    mockSpreads.push(created);
    return of(new HttpResponse({ status: 201, body: toSpreadDto(created) }));
  }

  // PUT /spreads/:id
  if (req.method === 'PUT' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    const payload = req.body as Spread | null;
    if (!payload?.id) {
      return of(new HttpResponse({ status: 400, body: invalidRequestBody() }));
    }
    if (payload.id !== id) {
      return of(new HttpResponse({ status: 400, body: spreadIdMismatch() }));
    }
    const existing = mockSpreads.find((spread) => spread.id === id);
    if (existing) {
      const body = structuredClone(payload);
      if (body.version !== existing.version) {
        return of(
          new HttpResponse({
            status: 409,
            body: versionConflict(body.version, existing.version),
          }),
        );
      }
      const updated: Spread = {
        ...body,
        version: body.version + 1,
        lastModifiedAt: new Date(),
      };
      mockSpreads = mockSpreads.map((spread) => (spread.id === id ? updated : spread));
      return of(new HttpResponse({ status: 200, body: toSpreadDto(updated) }));
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
      return of(
        new HttpResponse({
          status: 200,
          body: mockSnaps.map((snap) => toSnapMetaDataDto(snapToMetaData(snap))),
        }),
      );
    }
    const spreadId = new URLSearchParams(url.slice('snaps?'.length)).get('spreadId');
    const snaps = spreadId ? mockSnaps.filter((snap) => snap.spreadId === spreadId) : mockSnaps;
    return of(
      new HttpResponse({
        status: 200,
        body: snaps.map((snap) => toSnapMetaDataDto(snapToMetaData(snap))),
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
    return of(new HttpResponse({ status: 200, body: toSnapDto(snap) }));
  }

  // POST /snaps
  if (req.method === 'POST' && url === '/snaps') {
    const { spreadId } = (req.body ?? {}) as { spreadId?: string };
    if (!spreadId) {
      return of(
        new HttpResponse({
          status: 400,
          body: invalidRequestBody('spreadId is required.'),
        }),
      );
    }
    if (!isUuid(spreadId)) {
      return of(
        new HttpResponse({
          status: 400,
          body: invalidRequestBody('spreadId must be a valid UUID.'),
        }),
      );
    }
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
    return of(new HttpResponse({ status: 201, body: toSnapDto(created) }));
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
