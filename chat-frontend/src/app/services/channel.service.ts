import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiUrl = 'http://localhost:3000/channels'; // Base URL for channels

  constructor(private http: HttpClient) {}

  // Fetch all channels for a given group
  getChannels(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${groupId}`).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Create a new channel for a given group
  createChannel(groupId: number, channelName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, { groupId, channelName }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Update an existing channel for a given group
  updateChannel(groupId: number, channelId: number, channelName: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, { groupId, channelId, channelName }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Delete a channel by ID for a given group
  deleteChannel(groupId: number, channelId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${groupId}/${channelId}`).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong with the channel management service; please try again later.'));
  }
}
