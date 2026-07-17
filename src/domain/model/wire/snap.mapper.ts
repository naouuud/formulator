import { Snap } from '../snap';
import { SnapDto } from './snap.dto';

export function parseSnap(dto: SnapDto): Snap {
  return {
    ...dto,
    publishedAt: new Date(dto.publishedAt),
    closedAt: dto.closedAt ? new Date(dto.closedAt) : null,
  };
}

export function toSnapDto(snap: Snap): SnapDto {
  const { publishedAt, closedAt, ...rest } = snap;
  return {
    ...rest,
    publishedAt: publishedAt.toISOString(),
    closedAt: closedAt?.toISOString() ?? null,
  };
}
