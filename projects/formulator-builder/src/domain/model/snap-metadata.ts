import { Snap } from './snap';

export type SnapMetaData = Pick<
  Snap,
  'id' | 'spreadId' | 'spreadVersion' | 'edition' | 'publishedAt' | 'status'
> & {
  title: string;
};

export const toSnapMetaData = (snap: Snap): SnapMetaData => ({
  id: snap.id,
  spreadId: snap.spreadId,
  spreadVersion: snap.spreadVersion,
  title: snap.schema.title,
  edition: snap.edition,
  status: snap.status,
  publishedAt: snap.publishedAt,
});
