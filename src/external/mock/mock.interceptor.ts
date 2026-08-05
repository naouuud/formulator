import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { newSchema } from '@formulator/schema';
import { of } from 'rxjs';
import { toSnapMetaData } from 'src/domain/model/snap-metadata';
import { Spread } from 'src/domain/model/spread';
import { toSpreadMetaData } from 'src/domain/model/spread-metadata';
import { toSnapDto, toSnapMetaDataDto } from 'src/domain/model/wire/snap.mapper';
import { toSpreadDto, toSpreadMetaDataDto } from 'src/domain/model/wire/spread.mapper';
import { ENV } from '../../app/env';
import {
  conflict,
  invalidRequestBody,
  invalidUuid,
  missingUuid,
  snapNotFound,
  spillNotFound,
  spreadIdMismatch,
  spreadNotFound,
  versionConflict,
} from '../api/problem-detail';
import { mockSchema } from './mock-schema';
import { SpreadDto } from 'src/domain/model/wire/spread.dto';
import { MockSnap, isActiveMockSnap, mockSnapBody, mockSnapToSnap } from './mock-snap';
import { Spill } from 'src/domain/model/spill';
import { toSpillMetaData } from 'src/domain/model/spill-metadata';
import { toSpillMetaDataDto } from 'src/domain/model/wire/spill.mapper';
import { CreateSpillRequest } from '../api/spill.service';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_RE.test(value);

const newMockSpread = (spreadTitle: string, id?: string): Spread => {
  const schema = newSchema();
  return {
    id: id ?? crypto.randomUUID(),
    spreadTitle,
    version: 0,
    schema,
    createdAt: new Date(),
    lastModifiedAt: new Date(),
  };
};

let mockSpreads: Spread[] = [
  { ...newMockSpread('Mock Spread 1'), schema: structuredClone(mockSchema) },
  newMockSpread('Mock Spread 2'),
];

let mockSnaps: MockSnap[] = [];
let mockSpills: Spill[] = [];

type UpdateSpreadRequest = Partial<SpreadDto>;

const newSpill = (
  id: string,
  snapId: string,
  rSchema: any,
  email: string,
  firstName?: string,
  lastName?: string,
): Spill => ({
  id,
  snapId,
  firstName: firstName?.trim() ?? '',
  lastName: lastName?.trim() ?? '',
  email,
  rSchema,
  createdAt: new Date(),
  lastModifiedAt: null,
  completedAt: null,
  sentAt: new Date(),
  expiredAt: null,
});

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace(ENV.API_URL, '');

  // GET /spreads
  if (req.method === 'GET' && url === '/spreads') {
    const metaData = mockSpreads.map((spread) =>
      toSpreadMetaDataDto(toSpreadMetaData(structuredClone(spread))),
    );
    return of(new HttpResponse({ status: 200, body: metaData }));
  }

  // GET /spreads/:id
  if (req.method === 'GET' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    if (!isUuid(id)) {
      return of(new HttpResponse({ status: 400, body: invalidUuid('id') }));
    }
    const spread = mockSpreads.find((s) => s.id === id);
    if (!spread) {
      return of(new HttpResponse({ status: 404, body: spreadNotFound(id) }));
    }
    return of(new HttpResponse({ status: 200, body: toSpreadDto(structuredClone(spread)) }));
  }

  // POST /spreads
  if (req.method === 'POST' && url === '/spreads') {
    const { spreadTitle, id } = (req.body as { id?: string; spreadTitle?: string }) ?? {};
    if (!spreadTitle?.trim()) {
      return of(
        new HttpResponse({ status: 400, body: invalidRequestBody('spreadTitle is required.') }),
      );
    }
    const trimmedTitle = spreadTitle.trim();
    for (const spread of mockSpreads) {
      if (spread.spreadTitle === trimmedTitle) {
        return of(new HttpResponse({ status: 409, body: conflict('spread title') }));
      }
    }

    if (id) {
      if (!isUuid(id))
        return of(
          new HttpResponse({ status: 400, body: invalidRequestBody('id must be a valid UUID.') }),
        );
      for (const spread of mockSpreads) {
        if (spread.id === id) return of(new HttpResponse({ status: 409, body: conflict('id') }));
      }
    }

    const created = newMockSpread(trimmedTitle, id);
    mockSpreads.push(created);
    return of(new HttpResponse({ status: 201, body: toSpreadDto(structuredClone(created)) }));
  }

  // PUT /spreads/:id
  if (req.method === 'PUT' && url.startsWith('/spreads/')) {
    const urlId = url.slice('/spreads/'.length);
    if (urlId === '') {
      return of(new HttpResponse({ status: 400, body: missingUuid('id') }));
    }
    if (!isUuid(urlId)) {
      return of(new HttpResponse({ status: 400, body: invalidUuid('id') }));
    }
    const { id, spreadTitle, version, schema } = (req.body as UpdateSpreadRequest) ?? {};
    if (!id || spreadTitle === undefined || version === undefined || !schema) {
      return of(new HttpResponse({ status: 400, body: invalidRequestBody() }));
    }
    if (id !== urlId) {
      return of(new HttpResponse({ status: 400, body: spreadIdMismatch() }));
    }
    const existing = mockSpreads.find((spread) => spread.id === urlId);
    if (!existing) {
      return of(new HttpResponse({ status: 404, body: spreadNotFound(urlId) }));
    }
    if (version !== existing.version) {
      return of(
        new HttpResponse({
          status: 409,
          body: versionConflict(version, existing.version),
        }),
      );
    }
    const trimmedTitle = spreadTitle.trim();
    if (!trimmedTitle) {
      return of(
        new HttpResponse({
          status: 400,
          body: invalidRequestBody('spreadTitle is required.'),
        }),
      );
    }
    for (const spread of mockSpreads) {
      if (spread.id !== urlId && spread.spreadTitle === trimmedTitle) {
        return of(new HttpResponse({ status: 409, body: conflict('spread title') }));
      }
    }
    const updated: Spread = {
      ...existing,
      spreadTitle: trimmedTitle,
      version: existing.version + 1,
      schema,
      lastModifiedAt: new Date(),
    };
    mockSpreads = mockSpreads.map((spread) => (spread.id === urlId ? updated : spread));
    return of(new HttpResponse({ status: 200, body: toSpreadDto(structuredClone(updated)) }));
  }

  // DELETE /spreads/:id
  if (req.method === 'DELETE' && url.startsWith('/spreads/')) {
    const id = url.slice('/spreads/'.length);
    if (!isUuid(id)) {
      return of(new HttpResponse({ status: 400, body: invalidUuid('id') }));
    }
    const exists = mockSpreads.some((spread) => spread.id === id);
    if (exists) {
      mockSpreads = mockSpreads.filter((spread) => spread.id !== id);
      mockSnaps = mockSnaps.map((snap) =>
        snap.spreadId === id ? { ...snap, spreadId: null } : snap,
      );
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
          body: mockSnaps
            .filter(isActiveMockSnap)
            .map((snap) =>
              toSnapMetaDataDto(toSnapMetaData(mockSnapToSnap(structuredClone(snap)))),
            ),
        }),
      );
    }
    const params = new URLSearchParams(url.slice('snaps?'.length));
    if (params.has('spreadId')) {
      const spreadId = params.get('spreadId');
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
            body: invalidUuid('spreadId'),
          }),
        );
      }
      const snaps = mockSnaps.filter(
        (snap) => snap.spreadId === spreadId && isActiveMockSnap(snap),
      );
      return of(
        new HttpResponse({
          status: 200,
          body: snaps.map((snap) =>
            toSnapMetaDataDto(toSnapMetaData(mockSnapToSnap(structuredClone(snap)))),
          ),
        }),
      );
    }
    return of(
      new HttpResponse({
        status: 200,
        body: mockSnaps
          .filter(isActiveMockSnap)
          .map((snap) => toSnapMetaDataDto(toSnapMetaData(mockSnapToSnap(structuredClone(snap))))),
      }),
    );
  }

  // GET /snaps/:id
  if (req.method === 'GET' && url.startsWith('/snaps/')) {
    const id = url.slice('/snaps/'.length);
    if (!isUuid(id)) {
      return of(new HttpResponse({ status: 400, body: invalidUuid('id') }));
    }
    const snap = mockSnaps.find((snap) => snap.id === id);
    if (!snap || !isActiveMockSnap(snap)) {
      return of(new HttpResponse({ status: 404, body: snapNotFound(id) }));
    }
    return of(
      new HttpResponse({ status: 200, body: toSnapDto(mockSnapBody(structuredClone(snap))) }),
    );
  }

  // POST /snaps
  if (req.method === 'POST' && url === '/snaps') {
    const { spreadId, snapTitle: rawSnapTitle } = (req.body ?? {}) as {
      spreadId?: string;
      snapTitle?: string;
    };
    if (!spreadId) {
      return of(
        new HttpResponse({
          status: 400,
          body: invalidRequestBody('spreadId is required.'),
        }),
      );
    }
    const snapTitle = rawSnapTitle?.trim() ?? '';
    if (!snapTitle) {
      return of(
        new HttpResponse({
          status: 400,
          body: invalidRequestBody('snapTitle is required.'),
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
    const clonedSchema = structuredClone(spread.schema);
    clonedSchema.title = snapTitle;

    const snaps = mockSnaps.filter((s) => s.spreadId === spreadId);
    const latest = snaps.length ? Math.max(...snaps.map((s) => s.edition)) : 0;
    const created: MockSnap = {
      id: crypto.randomUUID(),
      spreadId,
      spreadVersion: spread.version,
      edition: latest + 1,
      schema: clonedSchema,
      publishedAt: new Date(),
      closedAt: null,
    };
    mockSnaps.push(created);
    return of(
      new HttpResponse({ status: 201, body: toSnapDto(mockSnapBody(structuredClone(created))) }),
    );
  }

  // DELETE /snaps/:id
  if (req.method === 'DELETE' && url.startsWith('/snaps/')) {
    const id = url.slice('/snaps/'.length);
    if (!isUuid(id)) {
      return of(new HttpResponse({ status: 400, body: invalidUuid('id') }));
    }
    const snap = mockSnaps.find((snap) => snap.id === id);
    if (!snap || !isActiveMockSnap(snap)) {
      return of(new HttpResponse({ status: 404, body: snapNotFound(id) }));
    }
    snap.closedAt = new Date();
    return of(new HttpResponse({ status: 204, body: null }));
  }

  // GET /spills?snapId=
  if (req.method === 'GET' && (url === '/spills' || url.startsWith('/spills?'))) {
    if (url === '/spills') {
      return of(new HttpResponse({ status: 400, body: missingUuid('snapId') }));
    }
    const snapId = new URLSearchParams(url.slice('/spills?'.length)).get('snapId');
    if (!snapId?.length) {
      return of(new HttpResponse({ status: 400, body: missingUuid('snapId') }));
    }
    if (!isUuid(snapId)) {
      return of(new HttpResponse({ status: 400, body: invalidUuid('snapId') }));
    }
    const spills = mockSpills.filter((spill) => spill.snapId === snapId);
    return of(
      new HttpResponse({
        status: 200,
        body: spills.map((spill) => toSpillMetaDataDto(toSpillMetaData(spill))),
      }),
    );
  }

  // POST /spills
  if (req.method === 'POST' && url === '/spills') {
    const { snapId, email, firstName, lastName } = (req.body as CreateSpillRequest) ?? {};
    if (!snapId || !email) {
      return of(
        new HttpResponse({
          status: 400,
          body: invalidRequestBody('snapId and email are required.'),
        }),
      );
    }
    if (!isUuid(snapId)) {
      return of(
        new HttpResponse({
          status: 400,
          body: invalidRequestBody('snapId must be a valid UUID.'),
        }),
      );
    }
    const snap = mockSnaps
      .filter((snap) => isActiveMockSnap(snap))
      .find((snap) => snap.id === snapId);
    if (!snap) {
      return of(new HttpResponse({ status: 404, body: snapNotFound(snapId) }));
    }

    const id = crypto.randomUUID();
    const rSchema = {};
    const created = newSpill(id, snapId, rSchema, email, firstName, lastName);
    mockSpills.push(created);
    return of(
      new HttpResponse({
        status: 201,
        body: toSpillMetaDataDto(toSpillMetaData(created)),
      }),
    );
  }

  // DELETE /spills/:id
  if (req.method === 'DELETE' && url.startsWith('/spills/')) {
    const id = url.slice('/spills/'.length);
    if (id === '') {
      return of(new HttpResponse({ status: 400, body: missingUuid('id') }));
    }
    if (!isUuid(id)) {
      return of(new HttpResponse({ status: 400, body: invalidUuid('id') }));
    }
    const spill = mockSpills.find((spill) => spill.id === id);
    if (!spill) {
      return of(new HttpResponse({ status: 404, body: spillNotFound(id) }));
    }

    mockSpills = mockSpills.filter((spill) => spill.id !== id);
    return of(new HttpResponse({ status: 204, body: null }));
  }

  return next(req);
};
