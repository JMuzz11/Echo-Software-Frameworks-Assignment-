import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Base URL of your backend server

  constructor(private http: HttpClient) {}

  // Login method that checks credentials against the backend
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        // Save the user data (excluding password) to session storage
        sessionStorage.setItem('user', JSON.stringify(response.user));
        return response;
      })
    );
  }

  // Registration method to create a new user
  register(username: string,email: string,  password: string ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password, email }).pipe(
      map(response => {
        return response;
      })
    );
  }

  // Logout method to clear the session storage
  logout(): void {
    sessionStorage.removeItem('user');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user');
  }

  getUserFromSession(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
 }