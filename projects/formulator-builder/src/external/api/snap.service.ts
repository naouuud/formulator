import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ENV } from '../../app/env';
import { Snap } from '../../domain/model/snap';
import { SnapDto, SnapMetaDataDto } from '../../domain/model/wire/snap.dto';
import { parseSnap, parseSnapMetaData } from '../../domain/model/wire/snap.mapper';
import { SnapMetaData } from '../../domain/model/snap-metadata';

@Injectable({ providedIn: 'root' })
export class SnapService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${ENV.API_URL}/snaps`;

  create(spreadId: string, snapTitle: string): Observable<Snap> {
    return this.#http
      .post<SnapDto>(`${this.#baseUrl}`, { spreadId, snapTitle })
      .pipe(map(parseSnap));
  }

  getAll(spreadId?: string): Observable<SnapMetaData[]> {
    const url = spreadId ? `${this.#baseUrl}?spreadId=${spreadId}` : this.#baseUrl;
    return this.#http.get<SnapMetaDataDto[]>(url).pipe(map((dtos) => dtos.map(parseSnapMetaData)));
  }

  getById(id: string): Observable<Snap> {
    return this.#http.get<SnapDto>(`${this.#baseUrl}/${id}`).pipe(map(parseSnap));
  }

  delete(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`);
  }
}
