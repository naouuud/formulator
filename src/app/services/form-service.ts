import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage';

type CreateFormResp = {
  status: string;
  id: string;
};

@Injectable({
  providedIn: 'root',
})
export class FormService {
  http;
  url = 'http://localhost:8080/form';

  constructor(private localStorage: LocalStorageService) {
    this.http = inject(HttpClient);
  }

  createForm(): Observable<CreateFormResp> {
    const tokenStr = this.localStorage.has('auth') ? this.localStorage.get<string>('auth')! : '';
    return this.http.post<CreateFormResp>(this.url, null, {
      headers: { Authorization: `Bearer ${tokenStr}` },
    });
  }

  deleteForm(formId: string): Observable<HttpResponse<void>> {
    const tokenStr = this.localStorage.has('auth') ? this.localStorage.get<string>('auth')! : '';
    return this.http.delete<void>(`${this.url}/${formId}`, {
      headers: { Authorization: `Bearer ${tokenStr}` },
      observe: 'response',
    });
  }
}
