import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/groups'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getGroupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createGroup(group: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, group);
  }

  updateGroup(id: number, group: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, group);
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
