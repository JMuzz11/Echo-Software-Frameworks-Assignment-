import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  groups: any[] = [];
  currentUser: any;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserFromSession();
    this.loadGroups();
  }
  
   // Method to load user data from session or service
   loadUserData() {
    this.user = this.authService.getUserFromSession(); // Fetch the user data from session
  }

  loadGroups() {
    this.groupService.getGroupsForUser(this.currentUser.id).subscribe(groups => {
      this.groups = groups;
    });
  }

  goToGroup(groupId: number) {
    this.router.navigate([`/group/${groupId}`]);
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
