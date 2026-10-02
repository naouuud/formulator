import { SpillWithSchema } from '../../../app/app-store';
import { SpillWithSchemaDto } from './spill-with-schema.dto';

export const toSpillWithSchema = (dto: SpillWithSchemaDto): SpillWithSchema => ({
  ...dto,
  createdAt: new Date(dto.createdAt),
  lastModifiedAt: dto.lastModifiedAt ? new Date(dto.lastModifiedAt) : null,
  completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
  sentAt: new Date(dto.sentAt),
  expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : null,
});
