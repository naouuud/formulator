import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ENV } from '../../app/env';
import { Spread, SpreadMetaData } from '../../domain/model/spread';
import { SpreadDto, SpreadMetaDataDto } from './spread.dto';
import { parseSpread } from './spread.mapper';

@Injectable({ providedIn: 'root' })
export class SpreadService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${ENV.API_URL}/spreads`;

  create(): Observable<Spread> {
    return this.#http.post<SpreadDto>(this.#baseUrl, {}).pipe(map(parseSpread));
  }

  getAll(): Observable<SpreadMetaData[]> {
    return this.#http
      .get<SpreadMetaDataDto[]>(this.#baseUrl)
      .pipe(map((dtos) => dtos.map(parseSpread)));
  }

  getById(id: string): Observable<Spread> {
    return this.#http.get<SpreadDto>(`${this.#baseUrl}/${id}`).pipe(map(parseSpread));
  }

  update(spread: Spread): Observable<Spread> {
    return this.#http
      .put<SpreadDto>(`${this.#baseUrl}/${spread.id}`, spread)
      .pipe(map(parseSpread));
  }

  delete(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`);
  }
}
