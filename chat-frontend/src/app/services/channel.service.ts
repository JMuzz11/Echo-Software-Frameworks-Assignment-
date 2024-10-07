import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiUrl = 'http://localhost:3000/channel'; // Base URL for channels

  constructor(private http: HttpClient) {}

  getChannels(groupId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${groupId}/channels`).pipe(
      catchError(this.handleError)
    );
  }

  createChannel(groupId: string, channelName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${groupId}/channels`, { name: channelName }).pipe(
      catchError(this.handleError)
    );
  }

  updateChannel(groupId: string, channelId: string, channelName: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${groupId}/channels/${channelId}`, { name: channelName }).pipe(
      catchError(this.handleError)
    );
  }

  deleteChannel(groupId: string, channelId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${groupId}/channels/${channelId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Error in channel service; please try again later.'));
  }
}
