import { Spread } from '../spread';
import { SpreadMetaData } from '../spread-metadata';

type WireDates = {
  readonly createdAt: string;
  readonly lastModifiedAt: string | null;
};

export type SpreadDto = Omit<Spread, 'createdAt' | 'lastModifiedAt'> & WireDates;

export type SpreadMetaDataDto = Omit<SpreadMetaData, 'createdAt' | 'lastModifiedAt'> & WireDates;
