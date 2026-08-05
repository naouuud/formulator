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
  readonly sentAt: Date;
  readonly expiredAt: Date | null;
};
