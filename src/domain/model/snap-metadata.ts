import { Snap } from './snap';

export type SnapMetaData = {
  id: string;
  spreadId: string;
  title: string;
  edition: number;
  status: 'ready' | 'active' | 'closed';
  publishedAt: Date;
  closedAt: Date | null;
};

export const toSnapMetaData = (snap: Snap): SnapMetaData => ({
  id: snap.id,
  spreadId: snap.spreadId,
  title: snap.schema.title,
  edition: snap.edition,
  status: snap.status,
  publishedAt: snap.publishedAt,
  closedAt: snap.closedAt,
});
