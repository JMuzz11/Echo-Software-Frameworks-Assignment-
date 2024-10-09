import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  socket: Socket;
  messages: any[] = [];
  newMessage: string = '';
  currentUser: any;
  groupId: string = '';

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

    // Fetch the groupId from the query parameters
    this.route.queryParams.subscribe(params => {
      this.groupId = params['groupId'];
      if (this.groupId) {
        this.socket.emit('joinGroup', this.groupId);
        console.log(`Joined group with ID: ${this.groupId}`);
        this.loadMessages();
      } else {
        console.error('No groupId found in route parameters');
      }
    });

    this.socket.on('receiveMessage', (message) => {
      this.messages.push(message);
      this.cdr.detectChanges();
    });
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

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  returnToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
