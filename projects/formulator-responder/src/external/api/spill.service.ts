import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ENV } from '../../app/env';
import { RSchema } from '@formulator/schema';
import { SpillWithSchemaDto } from './wire/spill-with-schema.dto';
import { toSpillWithSchema } from './wire/spill-with-schema.mapper';
import { SpillWithSchema } from '../../app/app-store';

@Injectable({ providedIn: 'root' })
export class SpillService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${ENV.API_URL}/spills`;

  getSpillWithSchema(spillId: string): Observable<SpillWithSchema> {
    return this.#http
      .get<SpillWithSchemaDto>(`${this.#baseUrl}/${spillId}`, {
        params: { schema: true },
      })
      .pipe(map(toSpillWithSchema));
  }

  updateSpill(spillId: string, rSchema: RSchema): Observable<any> {
    return this.#http.patch<any>(`${this.#baseUrl}/${spillId}`, { rSchema });
  }
}
