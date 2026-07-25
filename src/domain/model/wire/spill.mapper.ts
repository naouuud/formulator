import { Spill } from '../spill';
import { SpillMetaData } from '../spill-metadata';
import { SpillDto, SpillMetaDataDto } from './spill.dto';

export function parseSpill(dto: SpillDto): Spill {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
    completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
    sentAt: dto.sentAt ? new Date(dto.sentAt) : null,
    expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : null,
  };
}

export function parseSpillMetaData(dto: SpillMetaDataDto): SpillMetaData {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
    completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
    sentAt: dto.sentAt ? new Date(dto.sentAt) : null,
    expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : null,
  };
}

export function toSpillDto(spill: Spill): SpillDto {
  return {
    ...spill,
    createdAt: spill.createdAt.toISOString(),
    lastModifiedAt: spill.lastModifiedAt ? spill.lastModifiedAt.toISOString() : null,
    completedAt: spill.completedAt ? spill.completedAt.toISOString() : null,
    sentAt: spill.sentAt ? spill.sentAt.toISOString() : null,
    expiredAt: spill.expiredAt ? spill.expiredAt.toISOString() : null,
  };
}

export function toSpillMetaDataDto(metaData: SpillMetaData): SpillMetaDataDto {
  return {
    ...metaData,
    createdAt: metaData.createdAt.toISOString(),
    lastModifiedAt: metaData.lastModifiedAt ? metaData.lastModifiedAt.toISOString() : null,
    completedAt: metaData.completedAt ? metaData.completedAt.toISOString() : null,
    sentAt: metaData.sentAt ? metaData.sentAt.toISOString() : null,
    expiredAt: metaData.expiredAt ? metaData.expiredAt.toISOString() : null,
  };
}
