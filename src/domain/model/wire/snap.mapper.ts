import { Snap } from '../snap';
import { SnapDto } from './snap.dto';

export function parseSnap(snapDto: SnapDto): Snap {
  return { ...snapDto, createdAt: new Date(snapDto.createdAt) };
}
