import { Spill } from './spill';

export type SpillMetaData = Omit<Spill, 'rSchema'>;

export const toSpillMetaData = (spill: Spill): SpillMetaData => {
  const { rSchema, ...rest } = spill;
  return rest;
};
