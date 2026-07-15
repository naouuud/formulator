import { Page } from '../../../projects/schema/src/lib/page';

export interface Spread {
  readonly id: string;
  readonly title: string;
  readonly version: number;
  /** @property Estimated completion time in minutes */
  readonly ectm: number | null;
  readonly pages: Page[];
  readonly createdAt: Date | null;
  readonly lastModifiedAt: Date | null;
}
