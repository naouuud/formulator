import { Schema } from '@formulator/schema';

export interface Spread {
  readonly id: string;
  readonly version: number;
  /** @property Estimated completion time in minutes */
  readonly ectm: number | null;
  readonly schema: Schema;
  readonly createdAt: Date | null;
  readonly lastModifiedAt: Date | null;
}
