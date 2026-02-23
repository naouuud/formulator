import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage';
import { FormModel, FormModelDto } from '../models/form-model';
import { map, Observable, retry, tap } from 'rxjs';

type AuthResp = {
  id: string;
  auth: string;
  forms: FormModelDto[];
  status: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http;
  url = 'http://localhost:8080/auth/me';

  constructor(private localStorage: LocalStorageService) {
    this.http = inject(HttpClient); // gets the global singleton
  }

  bootstrap(): Observable<FormModelDto[]> {
    const tokenStr = this.localStorage.has('auth') ? this.localStorage.get<string>('auth')! : '';
    return this.http
      .get<AuthResp>(this.url, {
        headers: { Authorization: `Bearer ${tokenStr}` },
      })
      .pipe(
        retry(3),
        tap((res) => console.log(res)),
        tap((res) => {
          this.localStorage.set('auth', res.auth);
          this.localStorage.set('status', res.status);
          this.localStorage.set('id', res.id);
        }),
        map((res) => res.forms),
      );
  }
}
