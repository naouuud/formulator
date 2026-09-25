import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ENV } from '../app/env';
import { Schema } from '@formulator/schema';

@Injectable({ providedIn: 'root' })
export class SpillService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${ENV.API_URL}/spills`;

  getSchema(spillId: string): Observable<Schema> {
    return this.#http.get<Schema>(`${this.#baseUrl}/${spillId}/schema`);
  }
}
