import { Spread, SpreadMetaData } from '../../domain/model/spread';

type WireDates = {
  readonly createdAt: string | null;
  readonly lastModifiedAt: string | null;
};

export type SpreadDto = Omit<Spread, 'createdAt' | 'lastModifiedAt'> & WireDates;

export type SpreadMetaDataDto = Omit<SpreadMetaData, 'createdAt' | 'lastModifiedAt'> & WireDates;
