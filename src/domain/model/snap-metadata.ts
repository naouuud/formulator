import { Snap } from './snap';

export type SnapMetaData = {
  id: string;
  spreadId: string;
  title: string;
  edition: number;
  status: 'active' | 'closed';
  publishedAt: Date;
};

export const snapToMetaData = (snap: Snap): SnapMetaData => ({
  id: snap.id,
  spreadId: snap.spreadId,
  title: snap.schema.title,
  edition: snap.edition,
  status: snap.status,
  publishedAt: snap.publishedAt,
});
