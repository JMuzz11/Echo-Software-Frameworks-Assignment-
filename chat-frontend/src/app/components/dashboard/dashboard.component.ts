import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser(); // Assuming getCurrentUser() returns user data
  }

  selectChannel(group: any, channel: any): void {
    // Logic to select a channel and navigate to the chat component
    this.router.navigate(['/chat'], { queryParams: { groupId: group.id, channelId: channel.id } });
  }

  manageUsers(): void {
    this.router.navigate(['/users']);
  }

  manageGroups(): void {
    this.router.navigate(['/groups']);
  }

  manageChannels(): void {
    this.router.navigate(['/channels']);
  }
}
