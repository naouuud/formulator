import { SnapMetaData } from '../snap-metadata';

export type SnapMetaDataDto = Omit<SnapMetaData, 'publishedAt' | 'closedAt'> & {
  publishedAt: string;
  closedAt: string | null;
};
