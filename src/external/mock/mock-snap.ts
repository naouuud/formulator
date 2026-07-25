import { DEFAULT_SNAP_STATUS, Snap } from 'src/domain/model/snap';

/**
 * Snap domain shape including `closedAt` property.
 */
export type MockSnap = Omit<Snap, 'status'> & {
  closedAt: Date | null;
};

export const isActiveMockSnap = (snap: MockSnap): boolean => snap.closedAt === null;

/**
 * Helper method for transforming to `SnapMetaData`.
 */
export const mockSnapToSnap = (snap: MockSnap): Snap => {
  const { closedAt, ...body } = snap;
  return { ...body, status: DEFAULT_SNAP_STATUS };
};

/**
 * Mimics API behavior returning Snap without `closedAt`.
 */
export const mockSnapBody = (snap: MockSnap): Omit<Snap, 'status'> => {
  const { closedAt, ...body } = snap;
  return body;
};
