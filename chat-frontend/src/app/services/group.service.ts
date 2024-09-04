import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/groups'; // Base URL

  constructor(private http: HttpClient) {}

  // Fetch all groups
  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Fetch a specific group by ID
  getGroupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Create a new group (Note the `/create` endpoint)
  createGroup(group: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, group).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Update an existing group
  updateGroup(id: number, group: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, group).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Delete a group by ID
deleteGroup(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
    map(response => response),
    catchError(this.handleError)
  );
}


  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong with the group management service; please try again later.'));
  }
}
