import { Schema } from '@formulator/schema';

export type SnapStatus = 'ready' | 'active' | 'complete';

export const DEFAULT_SNAP_STATUS: SnapStatus = 'ready';

export type Snap = {
  readonly id: string;
  readonly spreadId: string;
  readonly spreadVersion: number;
  readonly edition: number;
  readonly schema: Schema;
  readonly status: SnapStatus;
  readonly publishedAt: Date;
};
