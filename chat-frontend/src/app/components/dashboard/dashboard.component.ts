import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-dashboard',
  standalone: true,  // Marking as a standalone component
  imports: [CommonModule],  // Import CommonModule for directives like ngIf, ngFor
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  groups: any[] = [];
  currentUser: any;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserFromSession();
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroupsForUser(this.currentUser.id).subscribe(groups => {
      this.groups = groups;
    });
  }

  goToGroup(groupId: number) {
    this.router.navigate([`/group/${groupId}`]); // Navigate to the group page
  }
  

  selectChannel(group: any, channel: any): void {
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

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}

