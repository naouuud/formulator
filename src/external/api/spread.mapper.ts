import { Spread, SpreadMetaData } from '../../domain/model/spread';
import { SpreadDto, SpreadMetaDataDto } from './spread.dto';

export type ParseSpreadResult<T extends SpreadDto | SpreadMetaDataDto> = T extends SpreadDto
  ? Spread
  : SpreadMetaData;

export function parseSpread<T extends SpreadDto | SpreadMetaDataDto>(dto: T): ParseSpreadResult<T> {
  const dates = {
    createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
    lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
  };

  return { ...dto, ...dates } as ParseSpreadResult<T>;
}
