import { Injectable } from '@angular/core';
import { Schema } from '@formulator/schema';
import { Observable, of } from 'rxjs';
import { mockSchema } from './mock/mock-schema';

@Injectable({ providedIn: 'root' })
export class SpillService {
  getSchema(spillId: string): Observable<Schema> {
    return of(mockSchema);
  }
}
