import { Schema } from '@formulator/schema';
import { SpillMetaData } from './spill-metadata';

export type SnapStatus = 'ready' | 'active' | 'complete';

export type Snap = {
  readonly id: string;
  readonly spreadId: string | null;
  readonly spreadVersion: number | null;
  readonly edition: number | null;
  readonly schema: Schema;
  readonly status: SnapStatus | null;
  readonly publishedAt: Date;
};

/** Derives snap status from its spills. No spills → ready; all terminal → complete; otherwise active. */
export function deriveSnapStatus(spills: SpillMetaData[]): SnapStatus {
  if (!spills.length) return 'ready';
  const complete = spills.every((spill) => !!(spill.completedAt || spill.expiredAt));
  return complete ? 'complete' : 'active';
}
