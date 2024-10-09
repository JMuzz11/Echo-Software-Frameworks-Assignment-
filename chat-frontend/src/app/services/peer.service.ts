import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Peer } from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  public myPeerId: string = uuidv4();
  public myPeer: any;

  constructor() {
    this.myPeer = new Peer(this.myPeerId, {
      host: 'localhost',
      port: 3000,
      path: '/peerjs',
      secure: false
    });

    this.myPeer.on('open', (id: string) => {
      console.log('Peer connected with ID:', id);
    });

    // Reconnect if needed
    this.myPeer.on('disconnected', () => {
      this.myPeer.reconnect();
    });
  }

  // Method to handle calls and streams
  handleCall(call: any, stream: MediaStream): void {
    call.answer(stream);
    call.on('stream', (remoteStream: MediaStream) => {
      // Process remoteStream (e.g., attach it to a video element)
    });
  }

  // Additional logic for other peer events can be added here.
}
