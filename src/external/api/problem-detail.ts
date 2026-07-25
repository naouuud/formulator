export type ProblemDetailCode =
  | 'INTERNAL_ERROR'
  | 'INVALID_REQUEST'
  | 'SPREAD_NOT_FOUND'
  | 'SNAP_NOT_FOUND'
  | 'SPILL_NOT_FOUND'
  | 'VERSION_CONFLICT';

export type ProblemDetail = {
  status: number;
  title: string;
  detail?: string;
  code: ProblemDetailCode;
};

export type VersionConflictDetail = ProblemDetail & {
  code: 'VERSION_CONFLICT';
  expectedVersion: number;
  actualVersion: number;
};

export const invalidRequestBody = (detail?: string): ProblemDetail => ({
  status: 400,
  title: 'Invalid request body',
  detail,
  code: 'INVALID_REQUEST',
});

export const invalidRequest = (detail?: string): ProblemDetail => ({
  status: 400,
  title: 'Invalid request',
  detail,
  code: 'INVALID_REQUEST',
});

export const missingUuid = (field: string) => invalidRequest(`${field} is required.`);
export const invalidUuid = (field: string) => invalidRequest(`${field} must be a valid UUID.`);

export const spreadNotFound = (id: string): ProblemDetail => ({
  status: 404,
  title: 'Spread not found',
  detail: `No spread exists with id ${id}.`,
  code: 'SPREAD_NOT_FOUND',
});

export const snapNotFound = (id: string): ProblemDetail => ({
  status: 404,
  title: 'Snap not found',
  detail: `No snap exists with id ${id}.`,
  code: 'SNAP_NOT_FOUND',
});

export const spillNotFound = (id: string): ProblemDetail => ({
  status: 404,
  title: 'Spill not found',
  detail: `No spill exists with id ${id}.`,
  code: 'SPILL_NOT_FOUND',
});

export const spreadIdMismatch = (): ProblemDetail => ({
  status: 400,
  title: 'Spread id in path and body must match',
  code: 'INVALID_REQUEST',
});

export const versionConflict = (
  expectedVersion: number,
  actualVersion: number,
): VersionConflictDetail => ({
  status: 409,
  title: 'Version conflict',
  detail: `Expected version ${expectedVersion} but found ${actualVersion}.`,
  code: 'VERSION_CONFLICT',
  expectedVersion,
  actualVersion,
});
