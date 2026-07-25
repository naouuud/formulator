export type Spill = {
  readonly id: string;
  readonly snapId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly rSchema: any;
  readonly createdAt: Date;
  readonly lastModifiedAt: Date | null;
  readonly completedAt: Date | null;
  readonly sentAt: Date | null;
  readonly expiredAt: Date | null;
};

export const newSpill = (
  id: string,
  snapId: string,
  rSchema: any,
  email: string,
  firstName?: string,
  lastName?: string,
): Spill => ({
  id,
  snapId,
  firstName: firstName?.trim() ?? '',
  lastName: lastName?.trim() ?? '',
  email,
  rSchema,
  createdAt: new Date(),
  lastModifiedAt: null,
  completedAt: null,
  sentAt: null,
  expiredAt: null,
});
