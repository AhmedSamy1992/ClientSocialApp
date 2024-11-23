import { inject, Injectable, signal } from '@angular/core';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_modules/pagination';
import { Message } from '../_modules/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

  //get messahes
  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('Container', container);

    return this.http.get<Message[]>(this.baseUrl + 'messages', {observe: 'response', params})
      .subscribe({
        next: response => setPaginatedResponse(response, this.paginatedResult)
      })
  }

}