import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  groups: any[] = [];
  users: any[] = []; // To hold all users
  groupMembers: any[] = []; // To hold the members of a selected group
  selectedUserId: string = ''; // To hold the selected user's ID
  groupForm: FormGroup;
  isEditing = false;
  groupId: string = ''; // To store the ID of the selected group

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService,
    private userService: UserService // Injecting UserService here
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadGroups();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }

  loadGroupMembers(): void {
    if (this.groupId) {
      this.groupService.getGroupById(this.groupId).subscribe((group: any) => {
        this.groupMembers = group.members;
      });
    }
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  selectGroup(group: any) {
    this.isEditing = true;
    this.groupId = group._id; // Set the group ID when a group is selected
    this.groupForm.patchValue(group);
    this.loadGroupMembers(); // Load members of the selected group
  }

  saveGroup() {
    if (this.groupForm.invalid) {
      return;
    }

    const groupData = this.groupForm.value;
    const currentUser = this.authService.getUserFromSession(); // Get current user from session
    const adminId = currentUser._id; // Use the ID from the logged-in user

    const requestData = {
      groupName: groupData.name,
      description: groupData.description,
      adminId: adminId
    };

    if (this.isEditing) {
      this.groupService.updateGroup(this.groupId, requestData).subscribe(() => {
        this.loadGroups();
        this.resetForm();
      });
    } else {
      this.groupService.createGroup(requestData).subscribe(() => {
        this.loadGroups();
        this.resetForm();
      });
    }
  }

  deleteGroup(group: any) {
    this.groupService.deleteGroup(group._id).subscribe(
      () => {
        this.loadGroups(); // Refresh the list of groups after deletion
      },
      error => {
        console.error('Error deleting group:', error);
      }
    );
  }

  resetForm() {
    this.isEditing = false;
    this.groupForm.reset();
  }

  returnToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  addUserToGroup(groupId: string): void {
    if (this.selectedUserId) {
      this.groupService.addUserToGroup(groupId, this.selectedUserId).subscribe({
        next: () => {
          alert('User added to the group successfully');
          this.loadGroups(); // Reload the groups to update the member list
        },
        error: (err) => {
          console.error('Error adding user to group:', err);
          alert('Error adding user to the group. Please try again.');
        }
      });
    }
  }
  
}
