import { Spill } from '../spill';
import { SpillMetaData } from '../spill-metadata';

type WireDates = {
  createdAt: string;
  lastModifiedAt: string | null;
  completedAt: string | null;
  sentAt: string;
  expiredAt: string | null;
};

export type SpillDto = Omit<
  Spill,
  'createdAt' | 'lastModifiedAt' | 'completedAt' | 'sentAt' | 'expiredAt'
> &
  WireDates;

export type SpillMetaDataDto = Omit<
  SpillMetaData,
  'createdAt' | 'lastModifiedAt' | 'completedAt' | 'sentAt' | 'expiredAt'
> &
  WireDates;
