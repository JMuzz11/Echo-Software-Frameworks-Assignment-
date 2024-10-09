import { Component, OnInit, OnDestroy } from '@angular/core';
import Peer from 'peerjs';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {
  peer: Peer | undefined;
  peerId: string | undefined;
  remotePeerId: string = '';
  localStream: MediaStream | undefined;
  call: any;

  ngOnInit(): void {
    // Initialize the PeerJS client
    this.peer = new Peer({
      host: 'localhost', // Change this to your deployed server address if not running locally
      port: 3000,
      path: '/peerjs',
      secure: false // Set this to true if using HTTPS
    });

    // Get the peer ID assigned by the server
    this.peer.on('open', (id) => {
      this.peerId = id;
      console.log('My peer ID is:', id);
    });

    // Listen for incoming calls
    this.peer.on('call', (call) => {
      this.answerCall(call);
    });
  }

  makeCall(): void {
    // Get the media stream (video and audio)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.localStream = stream;
      // Make a call to another peer using their ID
      const call = this.peer?.call(this.remotePeerId, stream);
      this.handleCallStream(call);
    }).catch((err) => {
      console.error('Error accessing media devices:', err);
    });
  }

  answerCall(call: any): void {
    // Answer the call with the local stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.localStream = stream;
      call.answer(stream);
      this.handleCallStream(call);
    }).catch((err) => {
      console.error('Error accessing media devices:', err);
    });
  }

  handleCallStream(call: any): void {
    call?.on('stream', (remoteStream: MediaStream) => {
      const videoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
      videoElement.srcObject = remoteStream;
      videoElement.play();
    });
  }

  ngOnDestroy(): void {
    if (this.call) {
      this.call.close();
    }
    this.peer?.destroy();
  }
}
