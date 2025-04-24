import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../models/default-response';
import { Paginator } from '../models/paginator';
import { PhoneNumber } from '../models/phone-number';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  httpClient = inject(HttpClient);

  getPhones(): Observable<Paginator<PhoneNumber>> {
    return this.httpClient.get<Paginator<PhoneNumber>>('/phone-numbers');
  }

  createPhone(phoneNumber: PhoneNumber): Observable<DefaultResponse> {
    return this.httpClient.post<DefaultResponse>('/phone-numbers', phoneNumber);
  }

  getPhone(phoneId: number): Observable<PhoneNumber> {
    return this.httpClient.get<PhoneNumber>(`/phone-numbers/${phoneId}`);
  }

  updatePhone(phoneId: number, phoneNumber: Partial<PhoneNumber>): Observable<DefaultResponse> {
    return this.httpClient.put<DefaultResponse>(`/phone-numbers/${phoneId}`, phoneNumber);
  }

  deletePhone(phoneId: number): Observable<DefaultResponse> {
    return this.httpClient.delete<DefaultResponse>(`/phone-numbers/${phoneId}`);
  }
}
