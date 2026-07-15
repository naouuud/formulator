import { Spread } from '../spread';
import { SpreadMetaData } from '../spread-metadata';
import { SpreadDto, SpreadMetaDataDto } from './spread.dto';

export function parseSpread(dto: SpreadDto): Spread {
  const dates = {
    createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
    lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
  };
  return { ...dto, ...dates };
}

export function parseSpreadMetaData(dto: SpreadMetaDataDto): SpreadMetaData {
  const dates = {
    createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
    lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
  };
  return { ...dto, ...dates };
}
