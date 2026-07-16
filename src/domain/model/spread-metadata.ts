import { Spread } from './spread';

export interface SpreadMetaData {
  readonly id: string;
  readonly title: string;
  readonly createdAt: Date | null;
  readonly lastModifiedAt: Date | null;
}

export const spreadToMetaData = (spread: Spread): SpreadMetaData => ({
  id: spread.id,
  title: spread.schema.title,
  createdAt: spread.createdAt,
  lastModifiedAt: spread.lastModifiedAt,
});

export const updateMetaData = (metaData: SpreadMetaData[], updated: Spread): SpreadMetaData[] =>
  metaData.map((spreadMetaData) =>
    spreadMetaData.id === updated.id ? spreadToMetaData(updated) : spreadMetaData,
  );
