import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/groups'; // Base URL for groups

  constructor(private http: HttpClient) {}

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getGroupById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createGroup(group: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, group).pipe(
      catchError(this.handleError)
    );
  }

  updateGroup(id: string, group: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, group).pipe(
      catchError(this.handleError)
    );
  }

  deleteGroup(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getGroupsForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }
  

  addChannelToGroup(groupId: string, channelName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${groupId}/channels`, { name: channelName }).pipe(
      catchError(this.handleError)
    );
  }

  addUserToGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${groupId}/addUser`, { userId }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Error in group service; please try again later.'));
  }
}
