import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../app/env';
import { Spread, SpreadMetaData } from '../../domain/model/spread';

@Injectable({ providedIn: 'root' })
export class SpreadService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${ENV.API_URL}/spreads`;

  create(): Observable<Spread> {
    return this.#http.post<Spread>(this.#baseUrl, {});
  }

  getAll(): Observable<SpreadMetaData[]> {
    return this.#http.get<SpreadMetaData[]>(this.#baseUrl);
  }

  getById(id: string): Observable<Spread> {
    return this.#http.get<Spread>(`${this.#baseUrl}/${id}`);
  }

  update(spread: Spread): Observable<Spread> {
    return this.#http.put<Spread>(`${this.#baseUrl}/${spread.id}`, spread);
  }

  delete(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`);
  }
}
