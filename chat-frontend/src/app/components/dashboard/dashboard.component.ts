import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserFromSession();
    if (this.currentUser && !this.currentUser.avatar) {
      console.warn('No avatar found for the current user.');
    }
    this.loadGroups();
  }

// dashboard.component.ts
loadGroups() {
  if (this.currentUser && this.currentUser._id) {
    this.groupService.getGroupsForUser(this.currentUser._id).subscribe(groups => {
      this.groups = groups;
    }, error => {
      console.error('Error loading groups:', error);
    });
  } else {
    console.error('No user ID found for the current user.');
  }
}


  goToGroup(groupId: string) {
    this.router.navigate([`/group/${groupId}`]);
  }

  selectChannel(group: any, channel: any): void {
    this.router.navigate(['/chat'], { queryParams: { groupId: group._id, channelId: channel.id } });
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

  addChannel(group: any): void {
    const channelName = prompt('Enter the name of the new channel:');
    if (channelName) {
      this.groupService.addChannelToGroup(group._id, channelName).subscribe(
        updatedGroup => {
          const groupIndex = this.groups.findIndex(g => g._id === group._id);
          if (groupIndex !== -1) {
            this.groups[groupIndex] = updatedGroup;
          }
        },
        error => {
          console.error('Error adding channel:', error);
        }
      );
    }
  }

uploadProfilePicture(): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', this.currentUser._id);
      this.http.post('http://localhost:3000/upload-avatar', formData).subscribe(
        (response: any) => {
          console.log('Avatar uploaded successfully:', response);
          this.currentUser.avatar = response.avatar; // Update the avatar in the session
          sessionStorage.setItem('user', JSON.stringify(this.currentUser)); // Save the updated user in session storage
        },
        error => {
          console.error('Error uploading avatar:', error);
        }
      );
    }
  };
  input.click();
}

  enterGroup(groupId: string): void {
    this.router.navigate(['/group', groupId]);
  }
  
}
