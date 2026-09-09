import { Spread } from '../spread';
import { SpreadMetaData } from '../spread-metadata';
import { SpreadDto, SpreadMetaDataDto } from './spread.dto';

export function parseSpread(dto: SpreadDto): Spread {
  const dates = {
    createdAt: new Date(dto.createdAt),
    lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
  };
  return { ...dto, ...dates };
}

export function parseSpreadMetaData(dto: SpreadMetaDataDto): SpreadMetaData {
  const dates = {
    createdAt: new Date(dto.createdAt),
    lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
  };
  return { ...dto, ...dates };
}

export function toSpreadDto(spread: Spread): SpreadDto {
  const { createdAt, lastModifiedAt, ...rest } = spread;
  return {
    ...rest,
    createdAt: createdAt.toISOString(),
    lastModifiedAt: lastModifiedAt?.toISOString() ?? null,
  };
}

/**
 * Wire type mapper for mock API.
 */
export function toSpreadMetaDataDto(metaData: SpreadMetaData): SpreadMetaDataDto {
  const { createdAt, lastModifiedAt, ...rest } = metaData;
  return {
    ...rest,
    createdAt: createdAt.toISOString(),
    lastModifiedAt: lastModifiedAt?.toISOString() ?? null,
  };
}
