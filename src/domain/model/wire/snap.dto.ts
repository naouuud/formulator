import { Snap } from '../snap';

type WireDates = {
  readonly publishedAt: string;
  readonly closedAt: string | null;
};

export type SnapDto = Omit<Snap, 'publishedAt' | 'closedAt'> & WireDates;
