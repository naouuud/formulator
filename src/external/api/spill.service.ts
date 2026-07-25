import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ENV } from 'src/app/env';
import { SpillMetaData } from 'src/domain/model/spill-metadata';
import { SpillMetaDataDto } from 'src/domain/model/wire/spill.dto';
import { parseSpillMetaData } from 'src/domain/model/wire/spill.mapper';

export type CreateSpillRequest = {
  snapId: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

@Injectable({ providedIn: 'root' })
export class SpillService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${ENV.API_URL}/spills`;

  create(req: CreateSpillRequest): Observable<SpillMetaData> {
    return this.#http.post<SpillMetaDataDto>(`${this.#baseUrl}`, req).pipe(map(parseSpillMetaData));
  }

  getAll(snapId: string): Observable<SpillMetaData[]> {
    const url = `${this.#baseUrl}?snapId=${snapId}`;
    return this.#http
      .get<SpillMetaDataDto[]>(url)
      .pipe(map((dtos) => dtos.map(parseSpillMetaData)));
  }

  delete(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`);
  }
}
