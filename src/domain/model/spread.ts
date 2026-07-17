import { Schema } from '@formulator/schema';
import { Snap } from './snap';

export interface Spread {
  readonly id: string;
  readonly version: number;
  /** @property Estimated completion time in minutes */
  readonly ectm: number | null;
  readonly schema: Schema;
  readonly createdAt: Date | null;
  readonly lastModifiedAt: Date | null;
}
