import { SnapMetaData } from '../snap-metadata';

export type SnapMetaDataDto = Omit<SnapMetaData, 'publishedAt'> & {
  publishedAt: string;
};
