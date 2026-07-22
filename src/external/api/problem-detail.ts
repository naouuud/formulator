export type ProblemDetailCode =
  | 'SPREAD_NOT_FOUND'
  | 'VERSION_CONFLICT'
  | 'SNAP_NOT_FOUND'
  | 'INVALID_REQUEST'
  | 'INTERNAL_ERROR';

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

export const invalidRequestBody = (detail?: string): ProblemDetail => ({
  status: 400,
  title: 'Invalid request body',
  detail,
  code: 'INVALID_REQUEST',
});

export const invalidUuid = (field: string) => invalidRequestBody(`${field} must be a valid UUID.`);

export const spreadIdMismatch = (): ProblemDetail => ({
  status: 400,
  title: 'Spread id in path and body must match',
  code: 'INVALID_REQUEST',
});
