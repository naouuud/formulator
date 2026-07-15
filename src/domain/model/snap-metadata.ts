import { Snap } from './snap';

export type SnapMetaData = {
  id: string;
  createdAt: Date;
  title: string;
};

export const snapToMetaData = (snap: Snap): SnapMetaData => ({
  id: snap.id,
  createdAt: snap.createdAt,
  title: snap.title,
});
