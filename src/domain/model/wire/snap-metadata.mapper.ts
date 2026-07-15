import { SnapMetaData } from '../snap-metadata';
import { SnapMetaDataDto } from './snap-metadata.dto';

export function parseSnapMetaData(metaData: SnapMetaDataDto): SnapMetaData {
  return {
    ...metaData,
    createdAt: new Date(metaData.createdAt),
  };
}
