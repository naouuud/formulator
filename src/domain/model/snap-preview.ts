import { Snap } from './snap';
import { Spread } from './spread';

export type SnapPreview = Omit<Snap, 'id'> & {
  id: null;
};

export function toSnapPreview(spread: Spread): SnapPreview {
  return {
    id: null,
    createdAt: new Date(),
    title: spread.title,
    schema: {
      title: spread.title,
      pages: spread.pages,
    },
  };
}
