import { SnapMetaData } from '../snap-metadata';
import { SnapMetaDataDto } from './snap-metadata.dto';

export function parseSnapMetaData(metaData: SnapMetaDataDto): SnapMetaData {
  return {
    ...metaData,
    publishedAt: new Date(metaData.publishedAt),
    closedAt: metaData.closedAt ? new Date(metaData.closedAt) : null,
  };
}

export function toSnapMetaDataDto(metaData: SnapMetaData): SnapMetaDataDto {
  const { publishedAt, closedAt, ...rest } = metaData;
  return {
    ...rest,
    publishedAt: publishedAt.toISOString(),
    closedAt: closedAt ? closedAt.toISOString() : null,
  };
}
