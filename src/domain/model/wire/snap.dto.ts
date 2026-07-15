import { Snap } from '../snap';

export type SnapDto = Omit<Snap, 'createdAt'> & {
  readonly createdAt: string;
};
