import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly SOCKET_URL = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.SOCKET_URL);
  }

  emitPeerID(peerID: string): void {
    this.socket.emit('peerID', peerID);
  }

  getPeerID(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('peerID', (data: string) => {
        observer.next(data);
      });
    });
  }

  // Disconnect and reconnect methods if needed
  disconnect(): void {
    this.socket.disconnect();
  }

  reconnect(): void {
    this.socket.connect();
  }
}
