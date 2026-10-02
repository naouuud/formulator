import { SpillWithSchema } from '../../../app/app-store';

type WireDates = {
  createdAt: string;
  lastModifiedAt: string | null;
  completedAt: string | null;
  sentAt: string;
  expiredAt: string | null;
};

export type SpillWithSchemaDto = Omit<
  SpillWithSchema,
  'createdAt' | 'lastModifiedAt' | 'completedAt' | 'sentAt' | 'expiredAt'
> &
  WireDates;
