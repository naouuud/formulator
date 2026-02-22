import {
  HttpClient,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  httpResource,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage';
import { FormModel } from '../models/form-model';
import { map, Observable, retry, tap } from 'rxjs';

type AuthResp = {
  auth: string;
  forms: FormModel[];
  status: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  bootstrapURL = 'http://localhost:8080/auth/me';

  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalStorageService,
  ) {}

  bootstrap(): Observable<FormModel[]> {
    const tokenStr = this.localStorage.has('auth') ? this.localStorage.get<string>('auth')! : '';
    return this.httpClient
      .get<AuthResp>(this.bootstrapURL, {
        responseType: 'json',
        headers: { Authorization: `Bearer ${tokenStr}` },
      })
      .pipe(
        tap((res) => console.log(res)),
        tap((res) => {
          this.localStorage.set('auth', res.auth);
          this.localStorage.set('status', res.status);
        }),
        map((res) => res.forms),
      );
  }
}
