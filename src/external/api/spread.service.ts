import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Spread } from 'src/domain/model/spread';
import { SpreadDto, SpreadMetaDataDto } from 'src/domain/model/wire/spread.dto';
import { parseSpread, parseSpreadMetaData } from 'src/domain/model/wire/spread.mapper';
import { ENV } from '../../app/env';
import { SpreadMetaData } from 'src/domain/model/spread-metadata';

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
      .pipe(map((dtos) => dtos.map(parseSpreadMetaData)));
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
