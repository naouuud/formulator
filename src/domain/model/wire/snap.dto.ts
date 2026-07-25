import { Snap } from '../snap';
import { SnapMetaData } from '../snap-metadata';

export type SnapDto = Omit<Snap, 'status' | 'publishedAt'> & {
  readonly publishedAt: string;
};

export type SnapMetaDataDto = Omit<SnapMetaData, 'status' | 'publishedAt'> & {
  publishedAt: string;
};
