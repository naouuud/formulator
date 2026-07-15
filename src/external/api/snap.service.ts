import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ENV } from 'src/app/env';
import { Snap } from 'src/domain/model/snap';
import { SnapMetaData } from 'src/domain/model/snap-metadata';
import { Spread } from 'src/domain/model/spread';
import { SnapMetaDataDto } from 'src/domain/model/wire/snap-metadata.dto';
import { parseSnapMetaData } from 'src/domain/model/wire/snap-metadata.mapper';
import { SnapDto } from 'src/domain/model/wire/snap.dto';
import { parseSnap } from 'src/domain/model/wire/snap.mapper';

@Injectable({ providedIn: 'root' })
export class SnapService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${ENV.API_URL}/snaps`;

  create(spread: Spread): Observable<Snap> {
    return this.#http.post<SnapDto>(`${this.#baseUrl}`, spread).pipe(map(parseSnap));
  }

  getAll(): Observable<SnapMetaData[]> {
    return this.#http
      .get<SnapMetaDataDto[]>(this.#baseUrl)
      .pipe(map((dtos) => dtos.map(parseSnapMetaData)));
  }

  getById(id: string): Observable<Snap> {
    return this.#http.get<SnapDto>(`${this.#baseUrl}/${id}`).pipe(map(parseSnap));
  }

  delete(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`);
  }
}
