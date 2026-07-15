import { Schema } from '@formulator/schema';

export type Snap = {
  readonly id: string;
  readonly createdAt: Date;
  readonly title: string;
  readonly schema: Schema;
};
