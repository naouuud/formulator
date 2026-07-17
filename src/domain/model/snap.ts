import { Schema } from '@formulator/schema';

export type Snap = {
  readonly id: string;
  readonly spreadId: string;
  readonly spreadVersion: number;
  readonly edition: number;
  readonly schema: Schema;
  readonly status: 'active' | 'closed';
  readonly publishedAt: Date;
  readonly closedAt: Date | null;
};
