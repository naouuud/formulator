import { Page } from './page';

export interface Spread {
  readonly id: string;
  readonly title: string;
  readonly version: number;
  /** @property Estimated completion time in minutes */
  readonly ectm: number | null;
  readonly pages: Page[];
  readonly createdAt: Date | null;
  readonly lastModifiedAt: Date | null;
}

export interface SpreadMetaData {
  readonly id: string;
  readonly title: string;
  readonly createdAt: Date | null;
  readonly lastModifiedAt: Date | null;
}

export const toMetaData = (spread: Spread): SpreadMetaData => ({
  id: spread.id,
  title: spread.title,
  createdAt: spread.createdAt,
  lastModifiedAt: spread.lastModifiedAt,
});

export const updateMetaData = (metaData: SpreadMetaData[], updated: Spread): SpreadMetaData[] =>
  metaData.map((spreadMetaData) =>
    spreadMetaData.id === updated.id ? toMetaData(updated) : spreadMetaData,
  );
