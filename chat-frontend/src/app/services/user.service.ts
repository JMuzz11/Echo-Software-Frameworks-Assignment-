import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
  
  // Get the current user information from session storage
  getCurrentUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

    // New method to update a user
    updateUser(user: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/user/${user.id}`, user);
    }
  
    // New method to add a user
    addUser(user: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/user`, user);
    }
  
    // New method to delete a user
    deleteUser(userId: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/user/${userId}`);
    }

  }