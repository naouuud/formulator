import { SnapMetaData } from '../snap-metadata';

export type SnapMetaDataDto = Omit<SnapMetaData, 'createdAt'> & {
  createdAt: string;
};
