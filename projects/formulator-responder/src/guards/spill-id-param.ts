import { isUuid } from '../utils/is-uuid';

/** Pure route-param check used by spillIdGuard. */
export function isValidSpillIdParam(spillId: string | null): spillId is string {
  return isUuid(spillId);
}
