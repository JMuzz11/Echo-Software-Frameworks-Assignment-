import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import Peer from 'peerjs';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})

export class GroupComponent implements OnInit, OnDestroy {
  socket: Socket;
  peer: Peer | undefined;
  call: any;
  localStream: MediaStream | undefined;
  groupId: string | null = null;
  currentUser: any;
  groupDetails: any = {};
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserFromSession();
    if (!this.currentUser) {
      this.router.navigate(['']);
      return;
    }

    this.groupId = this.route.snapshot.paramMap.get('groupId');
    if (this.groupId) {
      this.loadGroupDetails(this.groupId);
      this.socket.emit('joinGroup', this.groupId);
      console.log(`Joined group with ID: ${this.groupId}`);
      this.loadMessages();
    } else {
      console.error('No group ID found');
    }

    this.socket.on('receiveMessage', (message) => {
      this.messages.push(message);
      this.cdr.detectChanges();
    });

    this.initializePeer();
  }

  initializePeer(): void {
    this.peer = new Peer({
      host: 'localhost',
      port: 3000,
      path: '/peer.js',
      secure: false
    });

    this.peer.on('open', (id) => {
      console.log('My peer ID is:', id);
    });

    this.peer.on('call', (call) => {
      this.answerCall(call);
    });
  }

  startVideoChat(): void {
    if (this.groupId) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        this.localStream = stream;
        const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
        localVideo.srcObject = stream;
        localVideo.play();

        const remotePeerId = prompt('Enter the peer ID to connect with');
        if (remotePeerId) {
          this.call = this.peer?.call(remotePeerId, stream);
          this.handleCallStream(this.call);
        }
      }).catch((err) => {
        console.error('Error accessing media devices:', err);
      });
    } else {
      console.error('No group ID available for video chat');
    }
  }

  answerCall(call: any): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.localStream = stream;
      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      localVideo.srcObject = stream;
      localVideo.play();

      call.answer(stream);
      this.handleCallStream(call);
    }).catch((err) => {
      console.error('Error accessing media devices:', err);
    });
  }

  handleCallStream(call: any): void {
    call?.on('stream', (remoteStream: MediaStream) => {
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      remoteVideo.srcObject = remoteStream;
      remoteVideo.play();
    });
  }

  endVideoChat(): void {
    if (this.call) {
      this.call.close(); // Close the current call
      this.call = null; // Reset the call reference
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop()); // Stop all tracks of the local stream
      this.localStream = undefined;
    }

    // Clear the video elements
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    if (localVideo) {
      localVideo.srcObject = null;
    }

    const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    if (remoteVideo) {
      remoteVideo.srcObject = null;
    }

    console.log('Video chat ended');
  }

  ngOnDestroy(): void {
    this.endVideoChat(); // Ensure the video chat is ended when component is destroyed
    this.peer?.disconnect();
    this.socket.disconnect();
  }

  loadGroupDetails(groupId: string): void {
    this.http.get<any>(`http://localhost:3000/groups/${groupId}`).subscribe(
      group => {
        this.groupDetails = group;
        console.log('Group details:', group);
      },
      error => {
        console.error('Error loading group details:', error);
      }
    );
  }

  loadMessages(): void {
    if (this.groupId) {
      this.http.get<any[]>(`http://localhost:3000/messages/${this.groupId}`).subscribe(
        (messages) => {
          this.messages = messages;
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.groupId) {
      const messageData = {
        groupId: this.groupId,
        senderId: this.currentUser._id,
        senderName: this.currentUser.username,
        senderAvatar: this.currentUser.avatar,
        content: this.newMessage
      };

      this.socket.emit('sendMessage', messageData);

      this.http.post('http://localhost:3000/messages', messageData).subscribe(
        (response: any) => {
          this.messages.push(response);
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );

      this.newMessage = '';
    } else {
      console.error('Message or groupId is missing');
    }
  }

  returnToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
