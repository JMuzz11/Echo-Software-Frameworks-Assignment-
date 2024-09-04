import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly SOCKET_URL = 'http://localhost:3000'; // Replace with your actual server URL

  constructor() {
    // Initialize the socket connection when the service is instantiated
    this.socket = io(this.SOCKET_URL);
  }

  // Method to emit an event to the server
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Method to listen to an event from the server
  on<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });

      // Cleanup when the observer is unsubscribed
      return () => {
        this.socket.off(eventName);
      };
    });
  }

  // Disconnect the socket when no longer needed
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Reconnect the socket if needed
  reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    }
  }
}
