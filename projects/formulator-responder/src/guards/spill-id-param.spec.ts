import { describe, expect, it } from 'vitest';
import { isValidSpillIdParam } from './spill-id-param';

const VALID = 'bda33b8b-a223-4130-90f9-964eadfbb9a5';

describe('isValidSpillIdParam', () => {
  it('returns true for a lowercase UUID', () => {
    expect(isValidSpillIdParam(VALID)).toBe(true);
  });

  it('returns true for an uppercase UUID', () => {
    expect(isValidSpillIdParam(VALID.toUpperCase())).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidSpillIdParam(null)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isValidSpillIdParam('')).toBe(false);
  });

  it('returns false for a non-UUID string', () => {
    expect(isValidSpillIdParam('not-a-uuid')).toBe(false);
  });

  it('returns false for a UUID with wrong segment lengths', () => {
    expect(isValidSpillIdParam('bda33b8b-a223-4130-90f9-964eadfbb9a5-extra')).toBe(false);
  });
});
