import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/groups';

  constructor(private http: HttpClient) {}

  getMessages(groupId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${groupId}/messages`).pipe(
      catchError(this.handleError)
    );
  }

  sendMessage(groupId: string, messageData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/messages`, messageData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Error in chat service; please try again later.'));
  }
}
