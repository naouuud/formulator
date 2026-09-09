import { Spread } from './spread';

export type SpreadMetaData = Pick<Spread, 'id' | 'spreadTitle' | 'createdAt' | 'lastModifiedAt'>;

export const toSpreadMetaData = (spread: Spread): SpreadMetaData => ({
  id: spread.id,
  spreadTitle: spread.spreadTitle,
  createdAt: spread.createdAt,
  lastModifiedAt: spread.lastModifiedAt,
});

export const updateMetaData = (metaData: SpreadMetaData[], updated: Spread): SpreadMetaData[] =>
  metaData.map((spreadMetaData) =>
    spreadMetaData.id === updated.id
      ? {
          ...spreadMetaData,
          spreadTitle: updated.spreadTitle,
          lastModifiedAt: updated.lastModifiedAt,
        }
      : spreadMetaData,
  );
