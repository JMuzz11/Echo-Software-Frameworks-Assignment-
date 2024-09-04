import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiUrl = 'http://localhost:3000/channels'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getChannels(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/group/${groupId}`);
  }

  getChannelById(groupId: number, channelId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/${groupId}/channel/${channelId}`);
  }

  createChannel(groupId: number, channel: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/group/${groupId}/channel`, channel);
  }

  updateChannel(groupId: number, channelId: number, channel: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/group/${groupId}/channel/${channelId}`, channel);
  }

  deleteChannel(groupId: number, channelId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/group/${groupId}/channel/${channelId}`);
  }
}
