import { Spread } from './spread';

export interface SpreadMetaData {
  readonly id: string;
  readonly title: string;
  readonly createdAt: Date;
  readonly lastModifiedAt: Date | null;
}

export const toSpreadMetaData = (spread: Spread): SpreadMetaData => ({
  id: spread.id,
  title: spread.schema.title,
  createdAt: spread.createdAt,
  lastModifiedAt: spread.lastModifiedAt,
});

export const updateMetaData = (metaData: SpreadMetaData[], updated: Spread): SpreadMetaData[] =>
  metaData.map((spreadMetaData) =>
    spreadMetaData.id === updated.id ? toSpreadMetaData(updated) : spreadMetaData,
  );
