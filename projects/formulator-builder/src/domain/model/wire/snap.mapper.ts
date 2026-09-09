import { Snap } from '../snap';
import { SnapMetaData } from '../snap-metadata';
import { SnapDto, SnapMetaDataDto } from './snap.dto';

export function parseSnap(dto: SnapDto): Snap {
  return {
    ...dto,
    status: null,
    publishedAt: new Date(dto.publishedAt),
  };
}

export function toSnapDto(snap: Omit<Snap, 'status'>): SnapDto {
  const { publishedAt, ...rest } = snap;
  return {
    ...rest,
    publishedAt: publishedAt.toISOString(),
  };
}

export function parseSnapMetaData(metaData: SnapMetaDataDto): SnapMetaData {
  return {
    ...metaData,
    status: null,
    publishedAt: new Date(metaData.publishedAt),
  };
}

export function toSnapMetaDataDto(metaData: SnapMetaData): SnapMetaDataDto {
  const { status, publishedAt, ...rest } = metaData;
  return {
    ...rest,
    publishedAt: publishedAt.toISOString(),
  };
}
