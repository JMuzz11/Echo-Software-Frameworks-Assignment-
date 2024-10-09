import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Base URL for authentication

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }),
      catchError(this.handleError)
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    sessionStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user');
  }

  getUserFromSession(): any {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (!parsedUser._id) {
        console.error('User ID is missing from session storage');
      }
      if (!parsedUser.avatar) {
        console.warn('No avatar found for the current user.');
      }
      return parsedUser;
    } else {
      console.error('No user found in session storage');
      return null;
    }
  }
 

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Error in authentication service; please try again later.'));
  }
}
