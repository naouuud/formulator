import { SnapMetaData } from '../snap-metadata';
import { SnapMetaDataDto } from './snap-metadata.dto';

export function parseSnapMetaData(metaData: SnapMetaDataDto): SnapMetaData {
  return {
    ...metaData,
    publishedAt: new Date(metaData.publishedAt),
  };
}

export function toSnapMetaDataDto(metaData: SnapMetaData): SnapMetaDataDto {
  const { publishedAt, ...rest } = metaData;
  return {
    ...rest,
    publishedAt: publishedAt.toISOString(),
  };
}
